import React, { useState } from 'react';
import { Mic, MicOff, PhoneCall, PhoneOff, ChevronDown, ChevronUp } from 'lucide-react';
import type { TranscriptEntry } from '../types/chess';

interface VoiceCoachBarProps {
  modeLabel?: string;
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  error: string | null;
  transcript: TranscriptEntry[];
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMute: () => void;
}

export const VoiceCoachBar: React.FC<VoiceCoachBarProps> = ({
  modeLabel = 'Analysis Board',
  isConnected,
  isConnecting,
  isMuted,
  isSpeaking,
  error,
  transcript,
  onConnect,
  onDisconnect,
  onToggleMute,
}) => {
  const [showTranscript, setShowTranscript] = useState(true);

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-white/10">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected
                  ? isSpeaking
                    ? 'bg-zinc-100 animate-ping'
                    : 'bg-zinc-200'
                  : 'bg-zinc-600'
              }`}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Gemini Live Coach</h3>
            <p className="text-xs text-zinc-400">
              {isConnecting
                ? 'Connecting voice session...'
                : isConnected
                ? isSpeaking
                  ? 'Coach is speaking (interrupt anytime)'
                  : isMuted
                  ? 'Mic muted'
                  : `Listening — synced to ${modeLabel}`
                : `Voice coaching for ${modeLabel}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              onClick={onToggleMute}
              className={`p-2.5 rounded-xl border transition ${
                isMuted
                  ? 'bg-zinc-800 border-white/10 text-zinc-400'
                  : 'bg-zinc-900 border-white/15 text-zinc-100 hover:bg-zinc-800'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {!isConnected ? (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-semibold text-xs flex items-center gap-2 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {isConnecting ? 'Starting...' : 'Start Live Coach'}
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs flex items-center gap-2 border border-white/10 transition"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              End Session
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {transcript.length > 0 && (
        <div className="border-t border-white/5 pt-2.5">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 mb-2"
          >
            {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Live Transcript
          </button>

          {showTranscript && (
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
              {transcript.map((entry) => (
                <div
                  key={entry.id}
                  className={`text-xs leading-relaxed rounded-lg px-3 py-2 ${
                    entry.role === 'coach'
                      ? 'bg-zinc-900/90 text-zinc-200 border border-white/5'
                      : 'text-zinc-500 italic'
                  }`}
                >
                  {entry.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
