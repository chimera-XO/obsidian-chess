import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameHistoryEntry } from '../types/chess';

const LOCAL_CACHE_KEY = 'obsidian_chess_history_cache';

export interface SaveGameInput {
  mode: 'play' | 'pvp';
  opponent_name: string;
  player_color: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  end_reason: string;
  time_control_label: string;
  moves: string[];
  final_fen: string;
}

export function useGameHistory(userId: string) {
  const [games, setGames] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      if (supabase) {
        const { data, error: fetchErr } = await supabase
          .from('game_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchErr) throw new Error(fetchErr.message);
        setGames((data || []) as GameHistoryEntry[]);
        return;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not load game history';
      setError(msg);
      try {
        const cached = localStorage.getItem(`${LOCAL_CACHE_KEY}_${userId}`);
        if (cached) setGames(JSON.parse(cached));
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveGame = useCallback(
    async (input: SaveGameInput) => {
      if (!userId || input.moves.length === 0) return;

      const localEntry: GameHistoryEntry = {
        id: `local_${Date.now()}`,
        user_id: userId,
        ...input,
        created_at: new Date().toISOString(),
      };

      if (supabase) {
        const { data, error: insertErr } = await supabase
          .from('game_history')
          .insert({ user_id: userId, ...input })
          .select()
          .single();

        if (!insertErr && data) {
          setGames((prev) => [data as GameHistoryEntry, ...prev]);
          return;
        }
      }

      setGames((prev) => {
        const next = [localEntry, ...prev].slice(0, 50);
        try {
          localStorage.setItem(`${LOCAL_CACHE_KEY}_${userId}`, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [userId]
  );

  const deleteGame = useCallback(
    async (id: string) => {
      setGames((prev) => {
        const next = prev.filter((g) => g.id !== id);
        try {
          localStorage.setItem(`${LOCAL_CACHE_KEY}_${userId}`, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      if (supabase && !id.startsWith('local_')) {
        await supabase.from('game_history').delete().eq('id', id).eq('user_id', userId);
      }
    },
    [userId]
  );

  return { games, loading, error, loadHistory, saveGame, deleteGame };
}
