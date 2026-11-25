import React from 'react';
import { FileText, SlidersHorizontal, Cpu, ChevronRight } from 'lucide-react';

interface AnalyzeMenuProps {
  onOpenImportPgn: () => void;
  onOpenEditor: () => void;
  onOpenPlayAnalyzing: () => void;
}

export const AnalyzeMenu: React.FC<AnalyzeMenuProps> = ({
  onOpenImportPgn,
  onOpenEditor,
  onOpenPlayAnalyzing,
}) => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">Analyze</h1>
        <p className="text-xs text-zinc-400">
          Stockfish WASM evaluation bar &amp; Gemini 3.8 Live Voice Coach
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onOpenImportPgn}
          className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100">Import PGN</p>
              <p className="text-xs text-zinc-400">
                Paste any game notation and step through every move
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
        </button>

        <button
          type="button"
          onClick={onOpenEditor}
          className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100">Board Editor</p>
              <p className="text-xs text-zinc-400">
                Set up custom positions &amp; ask the coach how to win
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
        </button>

        <button
          type="button"
          onClick={onOpenPlayAnalyzing}
          className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100">Play While Analyzing</p>
              <p className="text-xs text-zinc-400">
                Explore lines freely with live Eval Bar, PV arrows &amp; Voice Coach
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
        </button>
      </div>
    </div>
  );
};
