import { Chess } from 'chess.js';
import type { BoardSnapshot, StockfishAnalysis } from '../types/chess';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const PIECE_NAMES: Record<string, string> = {
  k: 'K',
  q: 'Q',
  r: 'R',
  b: 'B',
  n: 'N',
  p: 'P',
};

export function getFenAtPly(movesSan: string[], ply: number, startFen = START_FEN): string {
  const chess = new Chess();
  try {
    chess.load(startFen);
  } catch {
    chess.reset();
  }
  const limit = Math.max(0, Math.min(ply, movesSan.length));
  for (let i = 0; i < limit; i++) {
    try {
      chess.move(movesSan[i]);
    } catch {
      break;
    }
  }
  return chess.fen();
}

export function uciPvToSan(fen: string, pv: string[]): string[] {
  if (!pv.length) return [];
  const temp = new Chess();
  try {
    temp.load(fen);
  } catch {
    return [];
  }

  const sanMoves: string[] = [];
  for (const uci of pv.slice(0, 8)) {
    if (!uci || uci.length < 4) break;
    try {
      const m = temp.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] || 'q',
      });
      if (!m) break;
      sanMoves.push(m.san);
    } catch {
      break;
    }
  }
  return sanMoves;
}

export function formatEval(analysis: StockfishAnalysis): string {
  if (analysis.mate !== null) {
    return analysis.mate > 0
      ? `White has forced Mate in ${analysis.mate}`
      : `Black has forced Mate in ${Math.abs(analysis.mate)}`;
  }
  if (analysis.cp !== null) {
    const pawns = analysis.cp / 100;
    if (Math.abs(pawns) < 0.15) return '0.0 (Equal)';
    const side = pawns > 0 ? 'White' : 'Black';
    return `${pawns > 0 ? '+' : ''}${pawns.toFixed(2)} (${side} advantage)`;
  }
  return 'Evaluating...';
}

export function buildBoardSnapshot(
  game: Chess,
  analysis: StockfishAnalysis,
  puzzleContext?: BoardSnapshot['puzzleContext']
): BoardSnapshot {
  const fen = game.fen();
  const whitePieces: string[] = [];
  const blackPieces: string[] = [];

  for (const row of game.board()) {
    for (const sq of row) {
      if (!sq) continue;
      const label = `${PIECE_NAMES[sq.type]}${sq.square}`;
      if (sq.color === 'w') whitePieces.push(label);
      else blackPieces.push(label);
    }
  }

  const bestLineUci = analysis.pv.slice(0, 8);
  const bestLineSan = uciPvToSan(fen, bestLineUci);

  return {
    fen,
    turn: game.turn() === 'w' ? 'White' : 'Black',
    inCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    moveHistorySan: game.history(),
    piecesSummary: `White: ${whitePieces.join(', ')} | Black: ${blackPieces.join(', ')}`,
    asciiBoard: game.ascii(),
    legalMoves: game.moves(),
    stockfishEval: formatEval(analysis),
    stockfishDepth: analysis.depth,
    bestLineUci,
    bestLineSan,
    puzzleContext,
  };
}

export function formatSnapshotForCoach(snapshot: BoardSnapshot, header?: string): string {
  const lines = [
    header || '[LIVE BOARD STATE SYNC]',
    `Side to move: ${snapshot.turn}${snapshot.inCheck ? ' (IN CHECK)' : ''}`,
    `FEN: ${snapshot.fen}`,
    `Pieces: ${snapshot.piecesSummary}`,
  ];

  if (snapshot.puzzleContext) {
    lines.push(
      `[PUZZLE MODE ACTIVE]`,
      `Puzzle: ${snapshot.puzzleContext.title} (${snapshot.puzzleContext.difficulty} · ${snapshot.puzzleContext.theme})`,
      `Puzzle Hint: ${snapshot.puzzleContext.hint}`,
      `Solved: ${snapshot.puzzleContext.solved ? 'YES' : 'NO'}`,
      `Secret Expected Next Move (UCI - DO NOT SPOIL UNLESS ASKED): ${snapshot.puzzleContext.expectedNextMoveUci || 'None'}`
    );
  } else {
    lines.push(
      `Moves played so far: ${snapshot.moveHistorySan.length ? snapshot.moveHistorySan.join(' ') : 'Starting position'}`,
      `Stockfish Eval (Depth ${snapshot.stockfishDepth}): ${snapshot.stockfishEval}`,
      `Stockfish Best Line (SAN): ${snapshot.bestLineSan.length ? snapshot.bestLineSan.join(' ') : 'Calculating...'}`,
      `Stockfish Best Line (UCI for arrows): ${snapshot.bestLineUci.length ? snapshot.bestLineUci.join(' ') : 'Calculating...'}`
    );
  }

  return lines.join('\n');
}
