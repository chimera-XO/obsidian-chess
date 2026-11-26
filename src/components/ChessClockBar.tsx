import React from 'react';
import { formatClockMs } from '../constants/timeControls';

interface ChessClockBarProps {
  name: string;
  color: 'w' | 'b';
  timeMs: number;
  isUntimed: boolean;
  isActive: boolean;
  statusTag?: string;
  capturedPieces?: string[];
  materialAdvantage?: number;
}

export const ChessClockBar: React.FC<ChessClockBarProps> = ({
  name,
  color,
  timeMs,
  isUntimed,
  isActive,
  statusTag,
  capturedPieces = [],
  materialAdvantage = 0,
}) => {
  const isLow = !isUntimed && timeMs > 0 && timeMs < 15_000;
  const isFlagged = !isUntimed && timeMs === 0;

  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition ${
        isActive
          ? 'glass-panel accent-active-strip'
          : 'glass-subtle'
      }`}
    >
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-3 h-3 rounded-sm border shrink-0 ${
              color === 'w' ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-800 border-zinc-600'
            }`}
          />
          <span className="text-xs font-semibold text-zinc-100 truncate">{name}</span>
          {statusTag && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 shrink-0">
              {statusTag}
            </span>
          )}
        </div>

        {(capturedPieces.length > 0 || materialAdvantage > 0) && (
          <div className="flex items-center gap-1 pl-5 text-[11px] leading-none text-zinc-400 overflow-hidden">
            <span className="tracking-tighter truncate">{capturedPieces.join('')}</span>
            {materialAdvantage > 0 && (
              <span className="font-mono text-[10px] font-semibold text-zinc-200 shrink-0">
                +{materialAdvantage}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={`font-mono text-sm font-semibold tabular-nums px-2.5 py-1.5 rounded-lg border transition shrink-0 ${
          isFlagged
            ? 'bg-red-950/70 text-red-200 border-red-500/40'
            : isLow && isActive
            ? 'bg-red-600 text-white border-red-400/50 animate-pulse'
            : isActive
            ? 'bg-zinc-100 text-zinc-950 border-white shadow-sm'
            : 'bg-black/40 text-zinc-400 border-white/5'
        }`}
      >
        {isUntimed ? '∞' : formatClockMs(timeMs)}
      </div>
    </div>
  );
};
