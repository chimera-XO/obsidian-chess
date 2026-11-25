import React, { useMemo } from 'react';
import { Chess, type Square } from 'chess.js';
import { Crown } from 'lucide-react';

export interface KingStatus {
  inCheck: boolean;
  isCheckmate: boolean;
  checkedKingSquare: Square | null;
  winnerKingSquare: Square | null;
}

export function getBoardKingStatus(fen: string): KingStatus {
  const empty: KingStatus = {
    inCheck: false,
    isCheckmate: false,
    checkedKingSquare: null,
    winnerKingSquare: null,
  };

  const chess = new Chess();
  try {
    chess.load(fen);
  } catch {
    return empty;
  }

  const inCheck = chess.inCheck();
  const isCheckmate = chess.isCheckmate();
  if (!inCheck && !isCheckmate) return empty;

  const loserColor = chess.turn();
  const winnerColor = loserColor === 'w' ? 'b' : 'w';

  let checkedKingSquare: Square | null = null;
  let winnerKingSquare: Square | null = null;

  for (const row of chess.board()) {
    for (const sq of row) {
      if (!sq || sq.type !== 'k') continue;
      if (sq.color === loserColor) checkedKingSquare = sq.square;
      if (sq.color === winnerColor) winnerKingSquare = sq.square;
    }
  }

  return {
    inCheck,
    isCheckmate,
    checkedKingSquare,
    winnerKingSquare: isCheckmate ? winnerKingSquare : null,
  };
}

export function mergeCheckSquareStyles(
  baseStyles: Record<string, React.CSSProperties>,
  kingStatus: KingStatus
): Record<string, React.CSSProperties> {
  if (!kingStatus.checkedKingSquare) return baseStyles;

  const next = { ...baseStyles };
  const sq = kingStatus.checkedKingSquare;

  if (kingStatus.isCheckmate) {
    next[sq] = {
      ...next[sq],
      background:
        'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(220, 38, 38, 0.55) 70%, rgba(185, 28, 28, 0.2) 100%)',
    };
  } else if (kingStatus.inCheck) {
    // Ordinary check: crisp red circle around the king
    next[sq] = {
      ...next[sq],
      background:
        'radial-gradient(circle, rgba(239, 68, 68, 0.14) 48%, rgba(239, 68, 68, 0.9) 56%, rgba(239, 68, 68, 0.9) 67%, transparent 72%)',
    };
  }

  return next;
}

interface KingStatusOverlayProps {
  fen: string;
  orientation?: 'white' | 'black';
}

function squareToGridPos(square: Square, orientation: 'white' | 'black') {
  const fileIdx = square.charCodeAt(0) - 97; // 0..7 (a..h)
  const rankIdx = parseInt(square[1], 10) - 1; // 0..7 (1..8)

  if (orientation === 'white') {
    return { leftPct: fileIdx * 12.5, topPct: (7 - rankIdx) * 12.5 };
  }
  return { leftPct: (7 - fileIdx) * 12.5, topPct: rankIdx * 12.5 };
}

export const KingStatusOverlay: React.FC<KingStatusOverlayProps> = ({
  fen,
  orientation = 'white',
}) => {
  const status = useMemo(() => getBoardKingStatus(fen), [fen]);

  if (!status.isCheckmate) return null;

  const winnerPos = status.winnerKingSquare
    ? squareToGridPos(status.winnerKingSquare, orientation)
    : null;

  return (
    <>
      {/* Flip the checkmated king upside down smoothly */}
      {status.checkedKingSquare && (
        <style>{`
          [data-square="${status.checkedKingSquare}"] [data-piece] {
            animation: king-flip-down 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: center center;
          }
        `}</style>
      )}

      {/* Green winner icon badge on the winning king */}
      {winnerPos && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[10px]">
          <div
            className="absolute flex items-start justify-end p-0.5"
            style={{
              left: `${winnerPos.leftPct}%`,
              top: `${winnerPos.topPct}%`,
              width: '12.5%',
              height: '12.5%',
            }}
          >
            <div className="winner-badge-anim w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.85)] border-2 border-zinc-950 flex items-center justify-center">
              <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
