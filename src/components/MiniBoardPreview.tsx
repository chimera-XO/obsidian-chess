import React, { useMemo } from 'react';
import { Chess } from 'chess.js';

const PIECE_GLYPHS: Record<string, string> = {
  wp: '♙',
  wn: '♘',
  wb: '♗',
  wr: '♖',
  wq: '♕',
  wk: '♔',
  bp: '♟',
  bn: '♞',
  bb: '♝',
  br: '♜',
  bq: '♛',
  bk: '♚',
};

interface MiniBoardPreviewProps {
  fen: string;
  darkSquare?: string;
  lightSquare?: string;
}

export const MiniBoardPreview: React.FC<MiniBoardPreviewProps> = ({
  fen,
  darkSquare = '#3b181b',
  lightSquare = '#7a5c58',
}) => {
  const squares = useMemo(() => {
    const chess = new Chess();
    try {
      chess.load(fen);
    } catch {
      // fallback to start position
    }
    const board = chess.board();
    const out: { key: string; isDark: boolean; glyph: string; isWhite: boolean }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        out.push({
          key: `${r}-${c}`,
          isDark: (r + c) % 2 === 1,
          glyph: piece ? PIECE_GLYPHS[`${piece.color}${piece.type}`] || '' : '',
          isWhite: piece?.color === 'w',
        });
      }
    }
    return out;
  }, [fen]);

  return (
    <div className="w-[104px] h-[104px] rounded-xl overflow-hidden grid grid-cols-8 grid-rows-8 border border-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.65)] shrink-0">
      {squares.map((sq) => (
        <div
          key={sq.key}
          style={{ backgroundColor: sq.isDark ? darkSquare : lightSquare }}
          className="flex items-center justify-center text-[10px] leading-none select-none"
        >
          {sq.glyph && (
            <span
              className={
                sq.isWhite
                  ? 'text-zinc-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                  : 'text-zinc-950 drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.35)]'
              }
            >
              {sq.glyph}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
