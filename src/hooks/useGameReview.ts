import { useState, useRef, useCallback, useEffect } from 'react';
import { Chess, type Square } from 'chess.js';
import type { MoveClassification, MoveReview } from '../types/chess';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const PIECE_VAL: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function materialFor(chess: Chess, color: 'w' | 'b'): number {
  let total = 0;
  for (const row of chess.board()) {
    for (const sq of row) {
      if (sq && sq.color === color) total += PIECE_VAL[sq.type] || 0;
    }
  }
  return total;
}

interface EvalResult {
  cp: number; // from White's perspective, mate mapped to +/- 10000
  bestMove: string | null;
}

function evalPosition(worker: Worker, fen: string, depth = 10): Promise<EvalResult> {
  return new Promise((resolve) => {
    const turn = fen.split(' ')[1] === 'b' ? 'b' : 'w';
    const sign = turn === 'w' ? 1 : -1;
    let latestCp = 0;
    let resolved = false;

    const finish = (bestMove: string | null) => {
      if (resolved) return;
      resolved = true;
      worker.removeEventListener('message', onMsg);
      resolve({ cp: latestCp, bestMove });
    };

    const onMsg = (e: MessageEvent) => {
      const line = typeof e.data === 'string' ? e.data : '';
      if (!line) return;
      if (line.startsWith('info') && line.includes(' score ')) {
        const mateMatch = line.match(/score mate (-?\d+)/);
        const cpMatch = line.match(/score cp (-?\d+)/);
        if (mateMatch) {
          const m = parseInt(mateMatch[1], 10);
          latestCp = (m > 0 ? 10000 : -10000) * sign;
        } else if (cpMatch) {
          latestCp = parseInt(cpMatch[1], 10) * sign;
        }
      } else if (line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const bm = parts[1] && parts[1] !== '(none)' ? parts[1] : null;
        finish(bm);
      }
    };

    worker.addEventListener('message', onMsg);
    worker.postMessage('stop');
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);

    window.setTimeout(() => finish(null), 3500);
  });
}

function classifyMove(
  cpLoss: number,
  isEngineTop: boolean,
  isSacrifice: boolean,
  wasWinningOrEqual: boolean
): MoveClassification {
  if (isEngineTop && isSacrifice && wasWinningOrEqual) return 'brilliant';
  if (isEngineTop || cpLoss <= 15) return 'best';
  if (cpLoss <= 45) return 'good';
  if (cpLoss <= 100) return 'inaccuracy';
  if (cpLoss <= 220) return 'mistake';
  return 'blunder';
}

export function useGameReview() {
  const [reviews, setReviews] = useState<Record<number, MoveReview>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const workerRef = useRef<Worker | null>(null);
  const runIdRef = useRef(0);

  const stopReview = useCallback(() => {
    runIdRef.current += 1;
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsReviewing(false);
  }, []);

  const clearReview = useCallback(() => {
    stopReview();
    setReviews({});
    setProgress({ current: 0, total: 0 });
  }, [stopReview]);

  const runReview = useCallback(
    async (movesSan: string[], initialFen = START_FEN) => {
      stopReview();
      if (!movesSan.length) {
        setReviews({});
        return;
      }

      const myRunId = ++runIdRef.current;
      setIsReviewing(true);
      setReviews({});
      setProgress({ current: 0, total: movesSan.length });

      const worker = new Worker('/stockfish/stockfish.js');
      workerRef.current = worker;

      // Wait for engine ready
      await new Promise<void>((resolve) => {
        const onReady = (e: MessageEvent) => {
          const line = typeof e.data === 'string' ? e.data : '';
          if (line === 'uciok' || line === 'readyok') {
            worker.removeEventListener('message', onReady);
            resolve();
          }
        };
        worker.addEventListener('message', onReady);
        worker.postMessage('uci');
        worker.postMessage('isready');
        window.setTimeout(resolve, 2500);
      });

      if (runIdRef.current !== myRunId) return;

      const chess = new Chess();
      try {
        chess.load(initialFen);
      } catch {
        chess.reset();
      }

      // Build position timeline
      const steps: {
        ply: number;
        fenBefore: string;
        fenAfter: string;
        san: string;
        uci: string;
        toSquare: Square;
        color: 'w' | 'b';
        isSacrifice: boolean;
      }[] = [];

      for (let i = 0; i < movesSan.length; i++) {
        const fenBefore = chess.fen();
        const mover = chess.turn();
        const matBefore = materialFor(chess, mover);
        let moved;
        try {
          moved = chess.move(movesSan[i]);
        } catch {
          break;
        }
        if (!moved) break;
        const matAfter = materialFor(chess, mover);
        const oppAttacksTo = chess.isAttacked(moved.to, mover === 'w' ? 'b' : 'w');
        const pieceVal = PIECE_VAL[moved.piece] || 0;
        const isSacrifice =
          (oppAttacksTo && pieceVal >= 3 && !moved.captured) || matAfter < matBefore;

        steps.push({
          ply: i + 1,
          fenBefore,
          fenAfter: chess.fen(),
          san: moved.san,
          uci: `${moved.from}${moved.to}${moved.promotion || ''}`,
          toSquare: moved.to,
          color: mover,
          isSacrifice,
        });
      }

      if (steps.length === 0) {
        stopReview();
        return;
      }

      let prevEval = await evalPosition(worker, steps[0].fenBefore, 10);

      for (let i = 0; i < steps.length; i++) {
        if (runIdRef.current !== myRunId) return;
        const step = steps[i];
        const nextEval = await evalPosition(worker, step.fenAfter, 10);
        if (runIdRef.current !== myRunId) return;

        // Centipawn loss from the mover's perspective
        const beforeForMover = step.color === 'w' ? prevEval.cp : -prevEval.cp;
        const afterForMover = step.color === 'w' ? nextEval.cp : -nextEval.cp;
        const cpLoss = Math.max(0, beforeForMover - afterForMover);

        const isEngineTop =
          Boolean(prevEval.bestMove) &&
          (prevEval.bestMove === step.uci || prevEval.bestMove?.slice(0, 4) === step.uci.slice(0, 4));

        const classification = classifyMove(
          cpLoss,
          isEngineTop,
          step.isSacrifice,
          afterForMover >= -50
        );

        const entry: MoveReview = {
          ply: step.ply,
          san: step.san,
          uci: step.uci,
          toSquare: step.toSquare,
          color: step.color,
          classification,
          cpLoss,
          bestMoveUci: prevEval.bestMove,
        };

        setReviews((prev) => ({ ...prev, [step.ply]: entry }));
        setProgress({ current: i + 1, total: steps.length });
        prevEval = nextEval;
      }

      if (runIdRef.current === myRunId) {
        worker.terminate();
        workerRef.current = null;
        setIsReviewing(false);
      }
    },
    [stopReview]
  );

  useEffect(() => {
    return () => stopReview();
  }, [stopReview]);

  return { reviews, isReviewing, progress, runReview, stopReview, clearReview };
}
