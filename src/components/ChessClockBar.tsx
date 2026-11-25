import React from 'react';
import { formatClockMs } from '../constants/timeControls';

interface ChessClockBarProps {
  name: string;
  color: 'w' | 'b';
  timeMs: number;
  isUntimed: boolean;
  isActive: boolean;
  statusTag?: string;
}

export const ChessClockBar: React.FC<ChessClockBarProps> = ({
  name,
  color,
  timeMs,
  isUntimed,
  isActive,
  statusTag,
}) => {
  const isLow = !isUntimed && timeMs > 0 && timeMs < 15_000;
  const isFlagged = !isUntimed && timeMs === 0;

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition ${
        isActive
          ? 'bg-zinc-900/95 border-white/20 shadow-md'
          : 'bg-zinc-950/60 border-white/5'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`w-3 h-3 rounded-sm border shrink-0 ${
            color === 'w' ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-800 border-zinc-600'
          }`}
        />
        <span className="text-xs font-medium text-zinc-200 truncate">{name}</span>
        {statusTag && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
            {statusTag}
          </span>
        )}
      </div>

      <div
        className={`font-mono text-sm font-semibold tabular-nums px-2.5 py-1 rounded-lg transition ${
          isFlagged
            ? 'bg-red-950/60 text-red-300 border border-red-500/30'
            : isLow && isActive
            ? 'bg-zinc-100 text-zinc-950 animate-pulse'
            : isActive
            ? 'bg-zinc-100 text-zinc-950'
            : 'bg-zinc-900 text-zinc-400'
        }`}
      >
        {isUntimed ? '∞' : formatClockMs(timeMs)}
      </div>
    </div>
  );
};
