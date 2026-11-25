import React, { useState } from 'react';
import { History, Sparkles, Trash2, RefreshCw, Swords, Users } from 'lucide-react';
import type { GameHistoryEntry } from '../types/chess';

interface HistoryPanelProps {
  games: GameHistoryEntry[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onReviewGame: (game: GameHistoryEntry) => void;
  onDeleteGame: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  games,
  loading,
  error,
  onRefresh,
  onReviewGame,
  onDeleteGame,
}) => {
  const [filter, setFilter] = useState<'all' | 'play' | 'pvp'>('all');
  const filtered = games.filter((g) => (filter === 'all' ? true : g.mode === filter));

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">History</h1>
          <p className="text-xs text-zinc-400">{filtered.length} saved games</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-300 disabled:opacity-40"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 p-1 rounded-xl glass-panel">
        {(
          [
            { id: 'all', label: 'All' },
            { id: 'play', label: 'vs Bot' },
            { id: 'pvp', label: 'PvP' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`py-1.5 rounded-lg text-xs font-medium transition ${
              filter === tab.id
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-[11px] text-zinc-400 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2">
          Run <code className="font-mono text-zinc-200">supabase/002_history_and_grants.sql</code> in Supabase to sync history across devices. Local cache is active.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl text-center py-10 px-4 space-y-2">
          <History className="w-6 h-6 text-zinc-500 mx-auto" />
          <p className="text-xs font-medium text-zinc-300">No saved games yet</p>
          <p className="text-[11px] text-zinc-500">
            Finished Bot and PvP matches are automatically saved here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => {
            const badgeStyle =
              g.result === 'win'
                ? 'bg-zinc-100 text-zinc-950'
                : g.result === 'draw'
                ? 'bg-zinc-800 text-zinc-200 border border-white/10'
                : 'bg-zinc-950 text-zinc-400 border border-white/10';

            const dateStr = new Date(g.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={g.id}
                className="glass-panel rounded-2xl p-3.5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      {g.mode === 'pvp' ? (
                        <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      ) : (
                        <Swords className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-zinc-100 truncate">
                        vs {g.opponent_name}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {g.time_control_label} · {g.moves.length} ply · {g.end_reason} · {dateStr}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase shrink-0 ${badgeStyle}`}
                  >
                    {g.result}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReviewGame(g)}
                    className="flex-1 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Review in Analysis
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteGame(g.id)}
                    className="p-2 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title="Delete Game"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
