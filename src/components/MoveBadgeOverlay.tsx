import React from 'react';
import type { MoveClassification, MoveReview } from '../types/chess';

export const CLASSIFICATION_META: Record<
  MoveClassification,
  { symbol: string; label: string; bg: string; text: string; pill: string }
> = {
  brilliant: {
    symbol: '!!',
    label: 'Brilliant',
    bg: '#06b6d4',
    text: '#083344',
    pill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/35',
  },
  best: {
    symbol: '★',
    label: 'Best',
    bg: '#10b981',
    text: '#022c22',
    pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35',
  },
  good: {
    symbol: '✓',
    label: 'Good',
    bg: '#4ade80',
    text: '#052e16',
    pill: 'bg-green-500/15 text-green-300 border-green-500/30',
  },
  inaccuracy: {
    symbol: '?!',
    label: 'Inaccuracy',
    bg: '#facc15',
    text: '#422006',
    pill: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/35',
  },
  mistake: {
    symbol: '?',
    label: 'Mistake',
    bg: '#fb923c',
    text: '#431407',
    pill: 'bg-orange-500/20 text-orange-300 border-orange-500/35',
  },
  blunder: {
    symbol: '??',
    label: 'Blunder',
    bg: '#ef4444',
    text: '#ffffff',
    pill: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
};

function squareToGrid(square: string, orientation: 'white' | 'black') {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1], 10) - 1;
  const col = orientation === 'white' ? file : 7 - file;
  const row = orientation === 'white' ? 7 - rank : rank;
  return { col, row };
}

interface MoveBadgeOverlayProps {
  review: MoveReview | undefined;
  orientation?: 'white' | 'black';
}

export const MoveBadgeOverlay: React.FC<MoveBadgeOverlayProps> = ({
  review,
  orientation = 'white',
}) => {
  if (!review) return null;
  const meta = CLASSIFICATION_META[review.classification];
  const { col, row } = squareToGrid(review.toSquare, orientation);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[10px]">
      <div
        className="absolute flex items-start justify-end p-0.5"
        style={{
          left: `${col * 12.5}%`,
          top: `${row * 12.5}%`,
          width: '12.5%',
          height: '12.5%',
        }}
      >
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-black shadow-lg border border-black/40"
          style={{ backgroundColor: meta.bg, color: meta.text }}
          title={meta.label}
        >
          {meta.symbol}
        </div>
      </div>
    </div>
  );
};
