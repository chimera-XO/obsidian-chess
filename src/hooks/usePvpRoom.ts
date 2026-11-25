import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, type Square } from 'chess.js';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ChessRoomRow, TimeControl } from '../types/chess';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

interface UsePvpRoomOptions {
  playerId: string;
  playerName: string;
}

export function usePvpRoom({ playerId, playerName }: UsePvpRoomOptions) {
  const [room, setRoom] = useState<ChessRoomRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlinePlayerIds, setOnlinePlayerIds] = useState<string[]>([]);
  const [displayClocks, setDisplayClocks] = useState<{ w: number; b: number }>({ w: 0, b: 0 });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const timeoutReportedRef = useRef<boolean>(false);

  const myColor: 'w' | 'b' | 'spectator' | null = !room
    ? null
    : room.white_player_id === playerId
    ? 'w'
    : room.black_player_id === playerId
    ? 'b'
    : 'spectator';

  const opponentId = !room
    ? null
    : myColor === 'w'
    ? room.black_player_id
    : myColor === 'b'
    ? room.white_player_id
    : null;

  const isOpponentOnline = Boolean(opponentId && onlinePlayerIds.includes(opponentId));

  useEffect(() => {
    if (!supabase || !room?.code || !playerId) return;

    const code = room.code;
    const channel = supabase
      .channel(`chess-room-${code}`, {
        config: { presence: { key: playerId } },
      })
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chess_rooms',
          filter: `code=eq.${code}`,
        },
        (payload) => {
          const updated = payload.new as ChessRoomRow;
          setRoom(updated);
          if (updated.status !== 'finished') {
            timeoutReportedRef.current = false;
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlinePlayerIds(Object.keys(state));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            playerId,
            name: playerName,
            joinedAt: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setOnlinePlayerIds([]);
    };
  }, [room?.code, playerId, playerName]);

  useEffect(() => {
    if (!room) return;

    const computeClocks = () => {
      let w = room.white_time_ms;
      let b = room.black_time_ms;

      const isTimed = room.base_time_ms > 0;
      const clockRunning =
        isTimed &&
        room.status === 'active' &&
        Boolean(room.last_move_at) &&
        Array.isArray(room.moves) &&
        room.moves.length > 0;

      if (clockRunning && room.last_move_at) {
        const elapsed = Math.max(0, Date.now() - new Date(room.last_move_at).getTime());
        if (room.turn === 'w') w = Math.max(0, w - elapsed);
        else b = Math.max(0, b - elapsed);
      }

      setDisplayClocks({ w, b });

      if (clockRunning && !timeoutReportedRef.current && (w === 0 || b === 0) && supabase) {
        timeoutReportedRef.current = true;
        const winner: 'w' | 'b' = w === 0 ? 'b' : 'w';
        supabase
          .from('chess_rooms')
          .update({
            status: 'finished',
            winner,
            end_reason: 'timeout',
            white_time_ms: w,
            black_time_ms: b,
            draw_offer_by: null,
          })
          .eq('id', room.id)
          .eq('status', 'active')
          .then(() => {});
      }
    };

    computeClocks();
    const interval = window.setInterval(computeClocks, 100);
    return () => window.clearInterval(interval);
  }, [room]);

  const syncUrlCode = (code: string | null) => {
    const url = new URL(window.location.href);
    if (code) url.searchParams.set('room', code);
    else url.searchParams.delete('room');
    window.history.replaceState({}, '', url.toString());
  };

  const createRoom = useCallback(
    async (preferredSide: 'w' | 'b' | 'random', timeControl: TimeControl) => {
      if (!supabase || !playerId) {
        setError('You must be signed in to create a room.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const chosenSide: 'w' | 'b' =
          preferredSide === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : preferredSide;
        const code = generateRoomCode();
        const displayName = playerName.trim() || 'Player';

        const insertPayload = {
          code,
          fen: START_FEN,
          moves: [],
          turn: 'w',
          status: 'waiting',
          winner: null,
          end_reason: null,
          draw_offer_by: null,
          white_player_id: chosenSide === 'w' ? playerId : null,
          white_player_name: chosenSide === 'w' ? displayName : null,
          black_player_id: chosenSide === 'b' ? playerId : null,
          black_player_name: chosenSide === 'b' ? displayName : null,
          time_control_id: timeControl.id,
          time_control_label: timeControl.label,
          base_time_ms: timeControl.baseMs,
          increment_ms: timeControl.incrementMs,
          white_time_ms: timeControl.baseMs,
          black_time_ms: timeControl.baseMs,
          last_move_at: null,
        };

        const { data, error: insertErr } = await supabase
          .from('chess_rooms')
          .insert(insertPayload)
          .select()
          .single();

        if (insertErr || !data) {
          throw new Error(insertErr?.message || 'Failed to create room.');
        }

        const created = data as ChessRoomRow;
        timeoutReportedRef.current = false;
        setRoom(created);
        syncUrlCode(created.code);
        return created;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to create room.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [playerId, playerName]
  );

  const joinRoom = useCallback(
    async (rawCode: string) => {
      if (!supabase || !playerId) {
        setError('You must be signed in to join a room.');
        return null;
      }

      const code = rawCode.trim().toUpperCase();
      if (!code) {
        setError('Enter a 6-character room code.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchErr } = await supabase
          .from('chess_rooms')
          .select('*')
          .eq('code', code)
          .single();

        if (fetchErr || !data) {
          throw new Error(`Room "${code}" not found.`);
        }

        let current = data as ChessRoomRow;
        const displayName = playerName.trim() || 'Player';

        const alreadySeated =
          current.white_player_id === playerId || current.black_player_id === playerId;

        if (!alreadySeated) {
          const updatePatch: Partial<ChessRoomRow> = {};
          if (!current.white_player_id) {
            updatePatch.white_player_id = playerId;
            updatePatch.white_player_name = displayName;
          } else if (!current.black_player_id) {
            updatePatch.black_player_id = playerId;
            updatePatch.black_player_name = displayName;
          }

          if (Object.keys(updatePatch).length > 0) {
            const bothSeated =
              Boolean(updatePatch.white_player_id || current.white_player_id) &&
              Boolean(updatePatch.black_player_id || current.black_player_id);

            if (bothSeated && current.status === 'waiting') {
              updatePatch.status = 'active';
            }

            const { data: updated, error: updateErr } = await supabase
              .from('chess_rooms')
              .update(updatePatch)
              .eq('id', current.id)
              .select()
              .single();

            if (updateErr) throw new Error(updateErr.message);
            if (updated) current = updated as ChessRoomRow;
          }
        }

        timeoutReportedRef.current = false;
        setRoom(current);
        syncUrlCode(current.code);
        return current;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Could not join room.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [playerId, playerName]
  );

  const makeMove = useCallback(
    async (from: Square, to: Square): Promise<boolean> => {
      if (!supabase || !room) return false;
      if (room.status !== 'active') return false;
      if (myColor !== 'w' && myColor !== 'b') return false;
      if (room.turn !== myColor) return false;

      const chess = new Chess(room.fen);
      let moveResult;
      try {
        moveResult = chess.move({ from, to, promotion: 'q' });
        if (!moveResult) return false;
      } catch {
        return false;
      }

      const nowIso = new Date().toISOString();
      let nextWhiteMs = room.white_time_ms;
      let nextBlackMs = room.black_time_ms;

      if (room.base_time_ms > 0) {
        const hadClockRunning = Boolean(room.last_move_at) && room.moves.length > 0;
        const elapsed =
          hadClockRunning && room.last_move_at
            ? Math.max(0, Date.now() - new Date(room.last_move_at).getTime())
            : 0;

        if (myColor === 'w') {
          nextWhiteMs = Math.max(0, nextWhiteMs - elapsed) + room.increment_ms;
        } else {
          nextBlackMs = Math.max(0, nextBlackMs - elapsed) + room.increment_ms;
        }
      }

      let status: ChessRoomRow['status'] = 'active';
      let winner: ChessRoomRow['winner'] = null;
      let endReason: string | null = null;

      if (chess.isCheckmate()) {
        status = 'finished';
        winner = myColor;
        endReason = 'checkmate';
      } else if (chess.isStalemate()) {
        status = 'finished';
        winner = 'draw';
        endReason = 'stalemate';
      } else if (chess.isThreefoldRepetition()) {
        status = 'finished';
        winner = 'draw';
        endReason = 'repetition';
      } else if (chess.isInsufficientMaterial()) {
        status = 'finished';
        winner = 'draw';
        endReason = 'insufficient material';
      } else if (chess.isDraw()) {
        status = 'finished';
        winner = 'draw';
        endReason = 'draw';
      }

      const nextMoves = [...(room.moves || []), moveResult.san];
      const patch = {
        fen: chess.fen(),
        moves: nextMoves,
        turn: chess.turn() as 'w' | 'b',
        status,
        winner,
        end_reason: endReason,
        draw_offer_by: null,
        white_time_ms: nextWhiteMs,
        black_time_ms: nextBlackMs,
        last_move_at: nowIso,
      };

      setRoom((prev) => (prev ? { ...prev, ...patch } : prev));

      const { error: updateErr } = await supabase
        .from('chess_rooms')
        .update(patch)
        .eq('id', room.id);

      if (updateErr) {
        setError(updateErr.message);
        return false;
      }

      return true;
    },
    [room, myColor]
  );

  const resign = useCallback(async () => {
    if (!supabase || !room || (myColor !== 'w' && myColor !== 'b')) return;
    if (room.status !== 'active') return;
    const winner: 'w' | 'b' = myColor === 'w' ? 'b' : 'w';
    await supabase
      .from('chess_rooms')
      .update({ status: 'finished', winner, end_reason: 'resignation', draw_offer_by: null })
      .eq('id', room.id);
  }, [room, myColor]);

  const offerDraw = useCallback(async () => {
    if (!supabase || !room || (myColor !== 'w' && myColor !== 'b')) return;
    if (room.status !== 'active') return;
    await supabase.from('chess_rooms').update({ draw_offer_by: myColor }).eq('id', room.id);
  }, [room, myColor]);

  const respondDraw = useCallback(
    async (accept: boolean) => {
      if (!supabase || !room) return;
      if (accept) {
        await supabase
          .from('chess_rooms')
          .update({
            status: 'finished',
            winner: 'draw',
            end_reason: 'agreement',
            draw_offer_by: null,
          })
          .eq('id', room.id);
      } else {
        await supabase.from('chess_rooms').update({ draw_offer_by: null }).eq('id', room.id);
      }
    },
    [room]
  );

  const requestRematch = useCallback(async () => {
    if (!supabase || !room) return;
    const patch = {
      fen: START_FEN,
      moves: [],
      turn: 'w' as const,
      status: room.white_player_id && room.black_player_id ? ('active' as const) : ('waiting' as const),
      winner: null,
      end_reason: null,
      draw_offer_by: null,
      white_player_id: room.black_player_id,
      white_player_name: room.black_player_name,
      black_player_id: room.white_player_id,
      black_player_name: room.white_player_name,
      white_time_ms: room.base_time_ms,
      black_time_ms: room.base_time_ms,
      last_move_at: null,
    };
    timeoutReportedRef.current = false;
    await supabase.from('chess_rooms').update(patch).eq('id', room.id);
  }, [room]);

  const leaveRoom = useCallback(() => {
    channelRef.current?.unsubscribe();
    channelRef.current = null;
    setRoom(null);
    setError(null);
    syncUrlCode(null);
  }, []);

  return {
    isSupabaseConfigured,
    room,
    myColor,
    isOpponentOnline,
    displayClocks,
    loading,
    error,
    createRoom,
    joinRoom,
    makeMove,
    resign,
    offerDraw,
    respondDraw,
    requestRematch,
    leaveRoom,
  };
}
