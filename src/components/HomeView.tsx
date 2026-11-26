import React, { useMemo } from 'react';
import {
  Swords,
  ChevronRight,
  LogOut,
  Sparkles,
  Palette,
  Flame,
  Zap,
  Timer,
  Target,
  Sun,
  Moon,
  Mic,
  TrendingUp,
  TrendingDown,
  Award,
} from 'lucide-react';
import { MiniBoardPreview } from './MiniBoardPreview';
import { computePlayerProgress, getTimeGreeting } from '../utils/playerStats';
import type { ChessPuzzle, GameHistoryEntry } from '../types/chess';

interface HomeViewProps {
  username: string;
  recentGames: GameHistoryEntry[];
  solvedPuzzlesCount: number;
  totalPuzzlesCount: number;
  nextPuzzle: ChessPuzzle;
  boardDarkSquare: string;
  boardLightSquare: string;
  onOpenPlaySetup: () => void;
  onOpenNextPuzzle: () => void;
  onOpenAnalyzeBoard: () => void;
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
  nextPuzzle,
  boardDarkSquare,
  boardLightSquare,
  onOpenPlaySetup,
  onOpenNextPuzzle,
  onOpenAnalyzeBoard,
  onOpenHistory,
  onReviewGame,
  onOpenAppearance,
  onSignOut,
}) => {
  const greeting = useMemo(() => getTimeGreeting(), []);
  const progress = useMemo(
    () => computePlayerProgress(recentGames, solvedPuzzlesCount),
    [recentGames, solvedPuzzlesCount]
  );

  const initials = (username || 'O').slice(0, 2).toUpperCase();
  const puzzlePct = Math.min(100, Math.round((solvedPuzzlesCount / Math.max(1, totalPuzzlesCount)) * 100));

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-44 space-y-5">
      {/* 1. Human Presence Header (Greeting + Avatar + Streak + Rank) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-11 rounded-2xl glass-panel flex items-center justify-center font-display text-sm font-bold text-zinc-100 shrink-0">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#08080a]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-zinc-100">
              {greeting.period === 'evening' ? (
                <Moon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              )}
              <h1 className="text-sm font-semibold truncate">
                {greeting.text}, <span className="font-bold">{username}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                {progress.streak}d
              </span>
              <span className="text-zinc-600">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                <Award className="w-3 h-3 text-zinc-300" />
                {progress.rankTitle}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
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

      {/* 2. Illustrated Hero Carousel (Peeking Next Card) */}
      <div className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {/* Hero Card 1: Next Tactical Puzzle with Live Mini-Board */}
        <div className="snap-start shrink-0 w-[86%] glass-panel rounded-3xl p-4 flex items-center justify-between gap-3.5 relative overflow-hidden">
          <div className="min-w-0 flex-1 space-y-2.5 z-10">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-200">
                Puzzle
              </span>
              <span className="text-[11px] text-zinc-400 truncate">{nextPuzzle.theme}</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-zinc-100 leading-snug line-clamp-1">
                {nextPuzzle.title}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className="h-full rounded-full accent-dot transition-all"
                    style={{ width: `${Math.max(6, puzzlePct)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                  {solvedPuzzlesCount}/{totalPuzzlesCount}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNextPuzzle}
              className="btn-tactile px-4 py-2 rounded-xl text-xs font-bold tracking-wide"
            >
              Solve!
            </button>
          </div>

          <MiniBoardPreview
            fen={nextPuzzle.fen}
            darkSquare={boardDarkSquare}
            lightSquare={boardLightSquare}
          />
        </div>

        {/* Hero Card 2: Live Voice Coach */}
        <div className="snap-start shrink-0 w-[82%] glass-panel rounded-3xl p-4 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-200">
              <Mic className="w-3 h-3" />
              Live Coach
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 leading-snug">
                Talk to Stockfish + Gemini
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Real-time voice analysis &amp; board arrows
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAnalyzeBoard}
              className="px-4 py-2 rounded-xl glass-subtle hover:border-white/25 text-xs font-semibold text-zinc-100 border-b-2 border-black/50 active:translate-y-0.5 transition"
            >
              Open Coach
            </button>
          </div>

          {/* Animated Audio Waveform */}
          <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 flex items-end justify-center gap-1.5 p-3.5 shrink-0">
            {[0, 0.18, 0.36, 0.12, 0.28].map((delay, idx) => (
              <span
                key={idx}
                className="eq-bar w-1.5 h-full rounded-full accent-dot"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Mode-Specific Ratings & Form Shelf */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ratings &amp; Form
          </h2>
          <button
            type="button"
            onClick={onOpenHistory}
            className="text-xs text-zinc-400 hover:text-zinc-100 flex items-center gap-0.5"
          >
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="-mx-4 px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
          {progress.ratings.map((r) => {
            const meta =
              r.id === 'rapid'
                ? { Icon: Timer, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' }
                : r.id === 'blitz'
                ? { Icon: Zap, color: 'text-amber-400 bg-amber-500/15 border-amber-500/25' }
                : r.id === 'bullet'
                ? { Icon: Flame, color: 'text-rose-400 bg-rose-500/15 border-rose-500/25' }
                : { Icon: Target, color: 'text-sky-400 bg-sky-500/15 border-sky-500/25' };

            return (
              <div
                key={r.id}
                className="shrink-0 w-[108px] glass-panel rounded-2xl p-3 flex flex-col items-center text-center gap-1.5"
              >
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${meta.color}`}>
                  <meta.Icon className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base font-bold text-zinc-100">{r.rating}</span>
                  {r.delta !== 0 && (
                    <span
                      className={`inline-flex items-center font-mono text-[10px] font-semibold ${
                        r.delta > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {r.delta > 0 ? (
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {Math.abs(r.delta)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400">{r.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Games */}
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
                        : g.result === 'loss'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
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

      {/* 5. Chunky Tactile Play CTA */}
      <div className="fixed bottom-24 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={onOpenPlaySetup}
            className="btn-tactile w-full py-4 rounded-2xl font-display font-bold tracking-[0.18em] uppercase text-sm flex items-center justify-center gap-2.5"
          >
            <Swords className="w-4 h-4" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
