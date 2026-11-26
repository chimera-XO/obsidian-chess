import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { CLASSIFICATION_META } from './MoveBadgeOverlay';
import type { MoveReview } from '../types/chess';

interface MoveHistoryNavigatorProps {
  moves: string[];
  viewPly: number;
  onChangePly: (ply: number) => void;
  moveReviews?: Record<number, MoveReview>;
}

export const MoveHistoryNavigator: React.FC<MoveHistoryNavigatorProps> = ({
  moves,
  viewPly,
  onChangePly,
  moveReviews,
}) => {
  const total = moves.length;
  const isAtStart = viewPly <= 0;
  const isAtLatest = viewPly >= total;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">Moves</span>
          {!isAtLatest && total > 0 && (
            <button
              type="button"
              onClick={() => onChangePly(total)}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-950 font-semibold"
            >
              {viewPly}/{total} · Live
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isAtStart}
            onClick={() => onChangePly(0)}
            className="p-1.5 rounded-lg glass-subtle hover:bg-zinc-800 disabled:opacity-30 text-zinc-200 transition"
            title="Start Position"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isAtStart}
            onClick={() => onChangePly(Math.max(0, viewPly - 1))}
            className="p-1.5 rounded-lg glass-subtle hover:bg-zinc-800 disabled:opacity-30 text-zinc-200 transition"
            title="Previous Move"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isAtLatest}
            onClick={() => onChangePly(Math.min(total, viewPly + 1))}
            className="p-1.5 rounded-lg glass-subtle hover:bg-zinc-800 disabled:opacity-30 text-zinc-200 transition"
            title="Next Move"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isAtLatest}
            onClick={() => onChangePly(total)}
            className="p-1.5 rounded-lg glass-subtle hover:bg-zinc-800 disabled:opacity-30 text-zinc-200 transition"
            title="Latest Move"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto bg-zinc-950/60 border border-white/5 rounded-xl p-2 font-mono text-xs text-zinc-300 flex flex-wrap gap-1">
        {total === 0 ? (
          <span className="text-zinc-600 px-1 py-0.5">No moves yet.</span>
        ) : (
          moves.map((m, idx) => {
            const ply = idx + 1;
            const isSelected = ply === viewPly;
            const rev = moveReviews?.[ply];
            const meta = rev ? CLASSIFICATION_META[rev.classification] : null;
            return (
              <React.Fragment key={idx}>
                {idx % 2 === 0 && (
                  <span className="text-zinc-500 pl-1 py-0.5 select-none">
                    {idx / 2 + 1}.
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onChangePly(ply)}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <span>{m}</span>
                  {meta && (
                    <span
                      className="inline-flex items-center justify-center rounded-full px-1 text-[9px] font-black leading-tight"
                      style={{ backgroundColor: meta.bg, color: meta.text }}
                    >
                      {meta.symbol}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};
