import { useEffect, useRef, useState, useCallback } from 'react';
import type { StockfishAnalysis } from '../types/chess';

const INITIAL_ANALYSIS: StockfishAnalysis = {
  depth: 0,
  cp: 0,
  mate: null,
  pv: [],
  bestMove: null,
  isThinking: false,
};

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [analysis, setAnalysis] = useState<StockfishAnalysis>(INITIAL_ANALYSIS);
  const turnRef = useRef<'w' | 'b'>('w');
  const bestMoveResolverRef = useRef<((move: string) => void) | null>(null);

  useEffect(() => {
    const worker = new Worker('/stockfish/stockfish.js');
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const line = typeof event.data === 'string' ? event.data : '';
      if (!line) return;

      if (line === 'uciok' || line === 'readyok') {
        setIsReady(true);
        return;
      }

      if (line.startsWith('info') && line.includes(' pv ')) {
        const depthMatch = line.match(/depth (\d+)/);
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const pvMatch = line.match(/ pv (.+)$/);

        const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;
        const sign = turnRef.current === 'w' ? 1 : -1;
        const cp = cpMatch ? parseInt(cpMatch[1], 10) * sign : null;
        const mate = mateMatch ? parseInt(mateMatch[1], 10) * sign : null;
        const pv = pvMatch ? pvMatch[1].trim().split(/\s+/) : [];

        setAnalysis((prev) => ({
          ...prev,
          depth,
          cp: mate !== null ? null : cp ?? prev.cp,
          mate,
          pv,
          isThinking: true,
        }));
      }

      if (line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const bestMove = parts[1] && parts[1] !== '(none)' ? parts[1] : null;
        setAnalysis((prev) => ({ ...prev, bestMove, isThinking: false }));

        if (bestMove && bestMoveResolverRef.current) {
          const resolve = bestMoveResolverRef.current;
          bestMoveResolverRef.current = null;
          resolve(bestMove);
        }
      }
    };

    worker.postMessage('uci');
    worker.postMessage('isready');

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    workerRef.current?.postMessage('stop');
    setAnalysis((prev) => ({ ...prev, isThinking: false }));
  }, []);

  const analyzePosition = useCallback((fen: string, depth = 16) => {
    if (!workerRef.current) return;
    const parts = fen.split(' ');
    turnRef.current = parts[1] === 'b' ? 'b' : 'w';

    setAnalysis((prev) => ({ ...prev, isThinking: true }));
    workerRef.current.postMessage('stop');
    workerRef.current.postMessage('setoption name Skill Level value 20');
    workerRef.current.postMessage(`position fen ${fen}`);
    workerRef.current.postMessage(`go depth ${depth}`);
  }, []);

  const getBestMove = useCallback(
    (fen: string, skillLevel = 10, depth = 12): Promise<string> => {
      return new Promise((resolve) => {
        if (!workerRef.current) {
          resolve('');
          return;
        }
        const parts = fen.split(' ');
        turnRef.current = parts[1] === 'b' ? 'b' : 'w';
        bestMoveResolverRef.current = resolve;

        setAnalysis((prev) => ({ ...prev, isThinking: true }));
        workerRef.current.postMessage('stop');
        workerRef.current.postMessage(`setoption name Skill Level value ${skillLevel}`);
        workerRef.current.postMessage(`position fen ${fen}`);
        workerRef.current.postMessage(`go depth ${depth}`);
      });
    },
    []
  );

  return { isReady, analysis, analyzePosition, getBestMove, stop };
}
