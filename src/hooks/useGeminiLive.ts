import { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { BoardArrow, BoardSnapshot, TranscriptEntry } from '../types/chess';
import { formatSnapshotForCoach } from '../utils/chessFormat';
import type { Square } from 'chess.js';

interface UseGeminiLiveOptions {
  getBoardSnapshot: () => BoardSnapshot;
  onDrawArrows: (arrows: BoardArrow[]) => void;
}

const SYSTEM_INSTRUCTION = `You are a sharp, encouraging Grandmaster chess coach speaking live over voice inside Obsidian Chess.
CRITICAL RULES:
1. YOU CAN ALWAYS SEE THE BOARD. The live chessboard state (FEN, exact piece locations, move history, and Stockfish evaluation or active Puzzle context) is pushed to you automatically AND is always available via get_board_analysis.
2. NEVER say "I can't see the board" or ask the user to describe the pieces.
3. NEVER hallucinate illegal moves. Ground every recommendation strictly in the Stockfish Best Line or Puzzle solution provided.
4. Keep spoken coaching crisp and conversational (1-3 sentences at a time). Speak moves naturally (e.g., "Knight to f3").
5. IN PUZZLE MODE:
   - Guide the student like a warm interactive tutor! Ask engaging prompts like "Can you find the right move here?" or "Look at the enemy king—what's the winning tactic?"
   - NEVER spoil the exact solution move immediately unless the student explicitly asks you to reveal the answer.
   - Give progressive hints (mention the tactical motif or which piece to look at first).
   - When they play a wrong move, encourage them gently and nudge them toward the right idea. When they solve it, congratulate them briefly and explain why the tactic worked.
6. IN ANALYSIS MODE:
   - Explain the strategic plan behind Stockfish's best line and call draw_board_arrows using UCI squares (e.g. from: "d2", to: "d4") so arrows appear on the board as you speak.`;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function base64ToInt16Array(base64: string): Int16Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
}

export function useGeminiLive({ getBoardSnapshot, onDrawArrows }: UseGeminiLiveOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const sessionRef = useRef<any>(null);
  const captureCtxRef = useRef<AudioContext | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef<boolean>(false);

  const appendTranscript = useCallback((role: 'coach' | 'system', text: string) => {
    if (!text.trim()) return;
    setTranscript((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === role && role === 'coach') {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      }
      return [
        ...prev.slice(-30),
        {
          id: `${Date.now()}-${Math.random()}`,
          role,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    });
  }, []);

  const flushPlaybackQueue = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {
        // ignore
      }
    });
    activeSourcesRef.current = [];
    if (playbackCtxRef.current) {
      nextPlayTimeRef.current = playbackCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
  }, []);

  const playPcmChunk = useCallback((base64Audio: string) => {
    const ctx = playbackCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const int16 = base64ToInt16Array(base64Audio);
    if (int16.length === 0) return;

    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startTime = Math.max(now + 0.02, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;
    setIsSpeaking(true);

    activeSourcesRef.current.push(source);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setIsSpeaking(false);
      }
    };
  }, []);

  const disconnect = useCallback(() => {
    flushPlaybackQueue();
    try {
      sessionRef.current?.close();
    } catch {
      // ignore
    }
    sessionRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    captureCtxRef.current?.close().catch(() => {});
    captureCtxRef.current = null;
    playbackCtxRef.current?.close().catch(() => {});
    playbackCtxRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
  }, [flushPlaybackQueue]);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    setError(null);
    setIsConnecting(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const playbackCtx = new AudioCtx();
      playbackCtxRef.current = playbackCtx;
      nextPlayTimeRef.current = playbackCtx.currentTime;
      if (playbackCtx.state === 'suspended') {
        playbackCtx.resume().catch(() => {});
      }
      const unlockBuf = playbackCtx.createBuffer(1, 1, 24000);
      const unlockSrc = playbackCtx.createBufferSource();
      unlockSrc.buffer = unlockBuf;
      unlockSrc.connect(playbackCtx.destination);
      unlockSrc.start(0);

      const tokenRes = await fetch('/api/token', { method: 'POST' });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.token) {
        throw new Error(tokenData.error || 'Could not retrieve ephemeral token.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({
        apiKey: tokenData.token,
        httpOptions: { apiVersion: 'v1beta' },
      });

      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
          outputAudioTranscription: {},
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'get_board_analysis',
                  description:
                    'Read the live chessboard: FEN, piece positions, move history, legal moves, Stockfish evaluation, or active puzzle context.',
                  parameters: { type: Type.OBJECT, properties: {} },
                },
                {
                  name: 'draw_board_arrows',
                  description:
                    'Draw arrows on the chessboard to visually highlight recommended moves or hints.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      arrows: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            from: { type: Type.STRING, description: 'Origin square e.g. e2' },
                            to: { type: Type.STRING, description: 'Target square e.g. e4' },
                            color: { type: Type.STRING, description: 'Optional CSS color' },
                          },
                          required: ['from', 'to'],
                        },
                      },
                    },
                    required: ['arrows'],
                  },
                },
              ],
            },
          ],
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            appendTranscript('system', 'Live Voice Coach connected.');
          },
          onmessage: (msg: any) => {
            if (msg.serverContent?.interrupted) flushPlaybackQueue();
            if (msg.serverContent?.outputTranscription?.text) {
              appendTranscript('coach', msg.serverContent.outputTranscription.text);
            }
            const parts = msg.serverContent?.modelTurn?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (part.inlineData?.data) playPcmChunk(part.inlineData.data);
              }
            }
            if (msg.toolCall?.functionCalls) {
              const functionResponses = msg.toolCall.functionCalls.map((call: any) => {
                if (call.name === 'get_board_analysis') {
                  return { id: call.id, name: call.name, response: { result: getBoardSnapshot() } };
                }
                if (call.name === 'draw_board_arrows') {
                  const rawArrows = call.args?.arrows || [];
                  const parsed: BoardArrow[] = rawArrows.map((a: any) => [
                    a.from as Square,
                    a.to as Square,
                    a.color || 'rgba(244, 244, 245, 0.85)',
                  ]);
                  onDrawArrows(parsed);
                  return { id: call.id, name: call.name, response: { result: { drawn: parsed.length } } };
                }
                return { id: call.id, name: call.name, response: { error: 'Unknown function' } };
              });
              sessionRef.current?.sendToolResponse({ functionResponses });
            }
          },
          onerror: (err: any) => {
            setError(err?.message || 'Live session error. Check API key & network.');
          },
          onclose: (evt: any) => {
            if (evt?.reason) appendTranscript('system', `Session closed: ${evt.reason}`);
            setIsConnected(false);
            setIsConnecting(false);
          },
        },
      });

      sessionRef.current = session;

      const captureCtx = new AudioCtx();
      captureCtxRef.current = captureCtx;
      if (captureCtx.state === 'suspended') await captureCtx.resume();
      await captureCtx.audioWorklet.addModule('/audio-processor.js');
      const source = captureCtx.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(captureCtx, 'pcm-capture-processor');

      workletNode.port.onmessage = (e) => {
        if (isMutedRef.current || !sessionRef.current) return;
        const base64Pcm = arrayBufferToBase64(e.data);
        try {
          sessionRef.current.sendRealtimeInput({
            audio: { data: base64Pcm, mimeType: 'audio/pcm;rate=16000' },
          });
        } catch {
          // ignore
        }
      };

      source.connect(workletNode);
      setIsConnected(true);
      setIsConnecting(false);

      const initialSnapshot = getBoardSnapshot();
      const greetingPrompt = initialSnapshot.puzzleContext
        ? `We are in Puzzle Mode on "${initialSnapshot.puzzleContext.title}" (${initialSnapshot.turn} to move). Introduce the puzzle briefly without spoiling the answer and ask "Can you find the right move here?"`
        : `Greet me briefly in 1 sentence confirming you can see the board (${initialSnapshot.turn} to move) and are ready to coach.`;

      session.sendRealtimeInput({
        text: `${formatSnapshotForCoach(initialSnapshot, '[INITIAL BOARD SYNC]')}\n\n${greetingPrompt}`,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start voice session');
      disconnect();
    }
  }, [
    isConnected,
    isConnecting,
    getBoardSnapshot,
    onDrawArrows,
    playPcmChunk,
    flushPlaybackQueue,
    appendTranscript,
    disconnect,
  ]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      isMutedRef.current = !prev;
      return !prev;
    });
  }, []);

  const syncBoardState = useCallback((snapshot: BoardSnapshot, spokenPrompt?: string) => {
    if (!sessionRef.current) return;
    const text = formatSnapshotForCoach(snapshot, spokenPrompt || '[LIVE BOARD STATE SYNC]');
    try {
      if (spokenPrompt) {
        sessionRef.current.sendRealtimeInput({ text });
      } else {
        sessionRef.current.sendClientContent({
          turns: [{ role: 'user', parts: [{ text }] }],
          turnComplete: false,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isMuted,
    isSpeaking,
    error,
    transcript,
    connect,
    disconnect,
    toggleMute,
    syncBoardState,
  };
}
