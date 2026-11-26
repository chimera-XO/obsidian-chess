import { Chess } from 'chess.js';

const START_COUNTS: Record<'q' | 'r' | 'b' | 'n' | 'p', number> = {
  q: 1,
  r: 2,
  b: 2,
  n: 2,
  p: 8,
};

const PIECE_VALUES: Record<'q' | 'r' | 'b' | 'n' | 'p', number> = {
  q: 9,
  r: 5,
  b: 3,
  n: 3,
  p: 1,
};

const SYMBOLS: Record<'w' | 'b', Record<'q' | 'r' | 'b' | 'n' | 'p', string>> = {
  w: { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

export interface MaterialSummary {
  capturedByWhite: string[]; // Black pieces White has captured
  capturedByBlack: string[]; // White pieces Black has captured
  whiteAdvantage: number;    // >0 if White is ahead
  blackAdvantage: number;    // >0 if Black is ahead
}

export function getMaterialSummary(fen: string): MaterialSummary {
  const empty: MaterialSummary = {
    capturedByWhite: [],
    capturedByBlack: [],
    whiteAdvantage: 0,
    blackAdvantage: 0,
  };

  const chess = new Chess();
  try {
    chess.load(fen);
  } catch {
    return empty;
  }

  const onBoard = {
    w: { q: 0, r: 0, b: 0, n: 0, p: 0 },
    b: { q: 0, r: 0, b: 0, n: 0, p: 0 },
  };

  for (const row of chess.board()) {
    for (const sq of row) {
      if (!sq || sq.type === 'k') continue;
      onBoard[sq.color][sq.type] += 1;
    }
  }

  const order: ('q' | 'r' | 'b' | 'n' | 'p')[] = ['q', 'r', 'b', 'n', 'p'];
  const capturedByWhite: string[] = [];
  const capturedByBlack: string[] = [];

  let whiteScore = 0;
  let blackScore = 0;

  for (const t of order) {
    whiteScore += onBoard.w[t] * PIECE_VALUES[t];
    blackScore += onBoard.b[t] * PIECE_VALUES[t];

    const missingBlack = Math.max(0, START_COUNTS[t] - onBoard.b[t]);
    for (let i = 0; i < missingBlack; i++) capturedByWhite.push(SYMBOLS.b[t]);

    const missingWhite = Math.max(0, START_COUNTS[t] - onBoard.w[t]);
    for (let i = 0; i < missingWhite; i++) capturedByBlack.push(SYMBOLS.w[t]);
  }

  const diff = whiteScore - blackScore;
  return {
    capturedByWhite,
    capturedByBlack,
    whiteAdvantage: diff > 0 ? diff : 0,
    blackAdvantage: diff < 0 ? Math.abs(diff) : 0,
  };
}
