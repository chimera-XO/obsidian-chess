import React, { useState } from 'react';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import { Chess } from 'chess.js';

const SAMPLE_OPERA_PGN = `1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#`;

interface ImportPgnViewProps {
  onImportSuccess: (movesSan: string[], finalFen: string) => void;
  onBack: () => void;
}

export const ImportPgnView: React.FC<ImportPgnViewProps> = ({ onImportSuccess, onBack }) => {
  const [pgnText, setPgnText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    setError(null);
    const cleaned = pgnText.trim();
    if (!cleaned) {
      setError('Paste a PGN game string first.');
      return;
    }

    const chess = new Chess();
    try {
      chess.loadPgn(cleaned);
      const moves = chess.history();
      if (moves.length === 0) {
        setError('No valid moves found in that PGN.');
        return;
      }
      onImportSuccess(moves, chess.fen());
    } catch {
      setError('Could not parse PGN. Check that the move notation is valid.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Import PGN</h2>
          <p className="text-xs text-zinc-400">Load any game directly into the Analysis Board</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            PGN Notation
          </label>
          <button
            type="button"
            onClick={() => {
              setPgnText(SAMPLE_OPERA_PGN);
              setError(null);
            }}
            className="text-[11px] font-medium text-zinc-300 hover:text-white underline underline-offset-2"
          >
            Load Sample (Opera Game)
          </button>
        </div>

        <textarea
          rows={7}
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5 a6..."
          className="w-full bg-zinc-950/80 border border-white/10 rounded-xl p-3 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
        />

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLoad}
          className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Open in Analysis Board
        </button>
      </div>
    </div>
  );
};
