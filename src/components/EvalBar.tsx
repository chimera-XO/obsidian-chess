import React from 'react';
import type { StockfishAnalysis } from '../types/chess';

interface EvalBarProps {
  analysis: StockfishAnalysis;
}

export const EvalBar: React.FC<EvalBarProps> = ({ analysis }) => {
  let whitePercent = 50;
  let label = '0.0';

  if (analysis.mate !== null) {
    whitePercent = analysis.mate > 0 ? 98 : 2;
    label = `M${Math.abs(analysis.mate)}`;
  } else if (analysis.cp !== null) {
    const pawns = analysis.cp / 100;
    whitePercent = Math.max(4, Math.min(96, 50 + pawns * 7.5));
    label = Math.abs(pawns) < 0.05 ? '0.0' : `${pawns > 0 ? '+' : ''}${pawns.toFixed(1)}`;
  }

  return (
    <div className="flex flex-col items-center select-none self-stretch">
      <div className="relative w-7 flex-1 min-h-[240px] rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shadow-inner">
        <div
          className="absolute bottom-0 left-0 right-0 bg-zinc-200 transition-all duration-500 ease-out"
          style={{ height: `${whitePercent}%` }}
        />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-500/50" />
        <span
          className={`absolute left-0 right-0 text-center font-mono text-[10px] font-semibold ${
            whitePercent > 50 ? 'bottom-1.5 text-zinc-900' : 'top-1.5 text-zinc-200'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
