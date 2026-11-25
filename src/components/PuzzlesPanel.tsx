import React, { useState, useEffect } from 'react';
import {
  Puzzle,
  Lightbulb,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Shuffle,
} from 'lucide-react';
import type { ChessPuzzle, PuzzleDifficulty } from '../types/chess';

const PAGE_SIZE = 20;

interface PuzzlesPanelProps {
  puzzles: ChessPuzzle[];
  currentPuzzle: ChessPuzzle;
  difficultyFilter: 'all' | PuzzleDifficulty;
  onChangeFilter: (f: 'all' | PuzzleDifficulty) => void;
  solvedIds: string[];
  status: 'playing' | 'wrong' | 'solved';
  stepIndex: number;
  showHintText: boolean;
  onSelectPuzzle: (puzzle: ChessPuzzle) => void;
  onRequestHint: () => void;
  onRetry: () => void;
  onNextPuzzle: () => void;
  onAskCoach: () => void;
  isCoachConnected: boolean;
}

export const PuzzlesPanel: React.FC<PuzzlesPanelProps> = ({
  puzzles,
  currentPuzzle,
  difficultyFilter,
  onChangeFilter,
  solvedIds,
  status,
  stepIndex,
  showHintText,
  onSelectPuzzle,
  onRequestHint,
  onRetry,
  onNextPuzzle,
  onAskCoach,
  isCoachConnected,
}) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(puzzles.length / PAGE_SIZE));

  useEffect(() => {
    const idx = puzzles.findIndex((p) => p.id === currentPuzzle.id);
    if (idx >= 0) {
      setPage(Math.floor(idx / PAGE_SIZE));
    } else {
      setPage(0);
    }
  }, [difficultyFilter, currentPuzzle.id, puzzles]);

  const pageStart = page * PAGE_SIZE;
  const visiblePuzzles = puzzles.slice(pageStart, pageStart + PAGE_SIZE);

  const totalUserMoves = Math.ceil(currentPuzzle.solution.length / 2);
  const completedUserMoves = Math.floor(stepIndex / 2);
  const sideToMove = currentPuzzle.fen.split(' ')[1] === 'b' ? 'Black' : 'White';
  const solvedInFilter = puzzles.filter((p) => solvedIds.includes(p.id)).length;

  const handleRandomUnsolved = () => {
    const unsolved = puzzles.filter((p) => !solvedIds.includes(p.id) && p.id !== currentPuzzle.id);
    const pool = unsolved.length > 0 ? unsolved : puzzles;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    onSelectPuzzle(pick);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Puzzle className="w-4 h-4 text-zinc-200" />
          <span className="text-sm font-semibold text-zinc-100">Tactical Puzzles</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          {solvedInFilter}/{puzzles.length} Solved
        </span>
      </div>

      <div className="grid grid-cols-4 p-1 rounded-xl bg-zinc-950/70 border border-white/5">
        {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => onChangeFilter(diff)}
            className={`py-1.5 rounded-lg text-xs font-medium capitalize transition ${
              difficultyFilter === diff
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-950/80 border border-white/10 p-3.5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">{currentPuzzle.title}</h3>
            <p className="text-xs text-zinc-400">
              {sideToMove} to move · {currentPuzzle.theme}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-zinc-900 border border-white/10 text-zinc-300">
            {currentPuzzle.difficulty}
          </span>
        </div>

        {status === 'solved' ? (
          <div className="flex items-center gap-2 text-xs text-zinc-100 bg-zinc-800/90 border border-white/15 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Brilliant! Puzzle solved.</span>
          </div>
        ) : status === 'wrong' ? (
          <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Not the best move — try again!</span>
          </div>
        ) : (
          <div className="text-xs text-zinc-400">
            Can you find the right move here?{' '}
            {totalUserMoves > 1 && (
              <span className="font-mono text-zinc-300">
                (Move {Math.min(completedUserMoves + 1, totalUserMoves)} of {totalUserMoves})
              </span>
            )}
          </div>
        )}

        {showHintText && status !== 'solved' && (
          <div className="text-xs text-zinc-200 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 leading-relaxed">
            <span className="font-semibold text-zinc-100">Hint: </span>
            {currentPuzzle.hint}
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={onRequestHint}
            disabled={status === 'solved'}
            className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 disabled:opacity-40 text-zinc-200 flex items-center justify-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-200 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
          <button
            type="button"
            onClick={handleRandomUnsolved}
            className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-200 flex items-center justify-center gap-1"
            title="Random Unsolved Puzzle"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Rand
          </button>
          <button
            type="button"
            onClick={onNextPuzzle}
            className="py-2 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center gap-1"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onAskCoach}
          className="w-full py-2 rounded-lg glass-subtle hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isCoachConnected ? 'Ask Coach for a Spoken Nudge' : 'Start Live Coach Below for Voice Guidance'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, puzzles.length)} of {puzzles.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="p-1 rounded glass-subtle hover:bg-zinc-800 disabled:opacity-30 text-zinc-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1.5">
              {page + 1}/{totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="p-1 rounded glass-subtle hover:bg-zinc-800 disabled:opacity-30 text-zinc-200"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
          {visiblePuzzles.map((p, idx) => {
            const globalIndex = pageStart + idx + 1;
            const isCurrent = p.id === currentPuzzle.id;
            const isSolved = solvedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPuzzle(p)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition border ${
                  isCurrent
                    ? 'bg-zinc-100 text-zinc-950 border-white'
                    : 'bg-zinc-950/60 text-zinc-200 border-white/5 hover:bg-zinc-900'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">
                    #{globalIndex} · {p.title}
                  </p>
                  <p className={`text-[10px] ${isCurrent ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {p.theme} · {p.difficulty}
                  </p>
                </div>
                {isSolved && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-zinc-900' : 'text-zinc-300'}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
