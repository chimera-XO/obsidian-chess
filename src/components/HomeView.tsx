import React from 'react';
import { Swords, Puzzle, Cpu, ChevronRight, LogOut, Sparkles, Palette } from 'lucide-react';
import type { GameHistoryEntry } from '../types/chess';

interface HomeViewProps {
  username: string;
  recentGames: GameHistoryEntry[];
  solvedPuzzlesCount: number;
  totalPuzzlesCount: number;
  onOpenPlaySetup: () => void;
  onOpenPuzzles: () => void;
  onOpenAnalyze: () => void;
  onOpenHistory: () => void;
  onReviewGame: (game: GameHistoryEntry) => void;
  onOpenAppearance: () => void;
  onSignOut: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  username,
  recentGames,
  solvedPuzzlesCount,
  totalPuzzlesCount,
  onOpenPlaySetup,
  onOpenPuzzles,
  onOpenAnalyze,
  onOpenHistory,
  onReviewGame,
  onOpenAppearance,
  onSignOut,
}) => {
  const wins = recentGames.filter((g) => g.result === 'win').length;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-44 space-y-5">
      {/* Profile Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center text-xl">
            ♞
          </div>
          <div>
            <h1 className="font-display text-base font-bold tracking-[0.14em] uppercase text-zinc-100">
              Obsidian Chess
            </h1>
            <p className="text-xs font-mono text-zinc-400">@{username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAppearance}
            className="p-2.5 rounded-xl glass-subtle hover:border-white/20 text-zinc-200 transition"
            title="Theme & Sound"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="p-2.5 rounded-xl glass-subtle hover:border-white/20 text-zinc-400 hover:text-zinc-100 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="glass-panel rounded-2xl p-3.5 text-center space-y-0.5">
          <p className="font-mono text-lg font-bold text-zinc-100">{recentGames.length}</p>
          <p className="text-[11px] text-zinc-400">Games</p>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 text-center space-y-0.5">
          <p className="font-mono text-lg font-bold text-zinc-100">{wins}</p>
          <p className="text-[11px] text-zinc-400">Wins</p>
        </div>
        <div className="glass-panel rounded-2xl p-3.5 text-center space-y-0.5">
          <p className="font-mono text-lg font-bold text-zinc-100">
            {solvedPuzzlesCount}/{totalPuzzlesCount}
          </p>
          <p className="text-[11px] text-zinc-400">Puzzles</p>
        </div>
      </div>

      {/* Quick Feature Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenPuzzles}
          className="glass-panel rounded-2xl p-4 text-left space-y-2.5 hover:border-white/25 transition"
        >
          <div className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-zinc-100">
            <Puzzle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Puzzles</p>
            <p className="text-[11px] text-zinc-400">515 tactics · Live Tutor</p>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenAnalyze}
          className="glass-panel rounded-2xl p-4 text-left space-y-2.5 hover:border-white/25 transition"
        >
          <div className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center text-zinc-100">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Analyze</p>
            <p className="text-[11px] text-zinc-400">PGN, Editor &amp; Coach</p>
          </div>
        </button>
      </div>

      {/* Recent Games Preview */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Recent Games
          </span>
          {recentGames.length > 0 && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-0.5"
            >
              See all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentGames.length === 0 ? (
          <p className="text-xs text-zinc-500 py-3 text-center">
            No games played yet. Tap Play below to start your first match.
          </p>
        ) : (
          <div className="space-y-2">
            {recentGames.slice(0, 3).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onReviewGame(g)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl glass-subtle hover:border-white/20 transition text-left"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-100 truncate">
                    vs {g.opponent_name}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500">
                    {g.time_control_label} · {g.end_reason}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                      g.result === 'win'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 border border-white/10'
                    }`}
                  >
                    {g.result}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sculpted Primary Play CTA anchored above Floating Glass Dock */}
      <div className="fixed bottom-24 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={onOpenPlaySetup}
            className="btn-primary w-full py-4 rounded-2xl font-display font-bold tracking-[0.16em] uppercase text-sm flex items-center justify-center gap-2.5"
          >
            <Swords className="w-4 h-4" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
