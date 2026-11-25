import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Sparkles, Copy, Check } from 'lucide-react';

const PIECES = [
  { code: 'wK', label: '♔' },
  { code: 'wQ', label: '♕' },
  { code: 'wR', label: '♖' },
  { code: 'wB', label: '♗' },
  { code: 'wN', label: '♘' },
  { code: 'wP', label: '♙' },
  { code: 'bK', label: '♚' },
  { code: 'bQ', label: '♛' },
  { code: 'bR', label: '♜' },
  { code: 'bB', label: '♝' },
  { code: 'bN', label: '♞' },
  { code: 'bP', label: '♟' },
];

interface BoardEditorControlsProps {
  selectedPiece: string | 'trash';
  onSelectPiece: (piece: string | 'trash') => void;
  turn: 'w' | 'b';
  onTurnChange: (turn: 'w' | 'b') => void;
  fen: string;
  onLoadFen: (fen: string) => void;
  onClearBoard: () => void;
  onResetBoard: () => void;
  onCoachFromHere: () => void;
  editorError: string | null;
}

export const BoardEditorControls: React.FC<BoardEditorControlsProps> = ({
  selectedPiece,
  onSelectPiece,
  turn,
  onTurnChange,
  fen,
  onLoadFen,
  onClearBoard,
  onResetBoard,
  onCoachFromHere,
  editorError,
}) => {
  const [fenInput, setFenInput] = useState(fen);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFenInput(fen);
  }, [fen]);

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Tap Piece, Then Tap Board
        </span>
        <button
          onClick={() => onSelectPiece('trash')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
            selectedPiece === 'trash'
              ? 'bg-zinc-100 text-zinc-950'
              : 'glass-subtle text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eraser
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {PIECES.map((p) => (
          <button
            key={p.code}
            onClick={() => onSelectPiece(p.code)}
            className={`h-10 rounded-lg text-2xl flex items-center justify-center transition ${
              selectedPiece === p.code
                ? 'bg-zinc-100 text-zinc-950 shadow-md ring-1 ring-white'
                : 'glass-subtle text-zinc-200 hover:bg-zinc-800'
            }`}
            title={p.code}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-400">Side to Move</span>
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          <button
            onClick={() => onTurnChange('w')}
            className={`px-3 py-1.5 text-xs font-medium transition ${
              turn === 'w' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            White
          </button>
          <button
            onClick={() => onTurnChange('b')}
            className={`px-3 py-1.5 text-xs font-medium transition ${
              turn === 'b' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            Black
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-400">FEN Position</label>
          <button
            onClick={handleCopyFen}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            placeholder="Paste FEN..."
            className="flex-1 bg-zinc-950/80 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-zinc-200 focus:outline-none focus:border-zinc-500"
          />
          <button
            onClick={() => onLoadFen(fenInput)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-200"
          >
            Load
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onClearBoard}
          className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Board
        </button>
        <button
          onClick={onResetBoard}
          className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Start Pos
        </button>
      </div>

      {editorError && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2">
          {editorError}
        </p>
      )}

      <button
        onClick={onCoachFromHere}
        className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        Analyze &amp; Coach From Here
      </button>
    </div>
  );
};
