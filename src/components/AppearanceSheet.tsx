import React from 'react';
import { X, Volume2, VolumeX, Check, Palette } from 'lucide-react';
import {
  UI_THEMES,
  BOARD_THEMES,
  type UiThemeId,
  type BoardThemeId,
} from '../constants/themes';

interface AppearanceSheetProps {
  open: boolean;
  onClose: () => void;
  uiTheme: UiThemeId;
  onSelectUiTheme: (id: UiThemeId) => void;
  boardTheme: BoardThemeId;
  onSelectBoardTheme: (id: BoardThemeId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const AppearanceSheet: React.FC<AppearanceSheetProps> = ({
  open,
  onClose,
  uiTheme,
  onSelectUiTheme,
  boardTheme,
  onSelectBoardTheme,
  soundEnabled,
  onToggleSound,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md glass-panel rounded-3xl p-5 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-zinc-200" />
            <h2 className="font-display text-sm font-bold tracking-wider uppercase text-zinc-100">
              Appearance &amp; Audio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* UI Theme */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Glass Theme
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {UI_THEMES.map((t) => {
              const active = uiTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectUiTheme(t.id)}
                  className={`p-3 rounded-2xl text-left transition border ${
                    active
                      ? 'bg-zinc-900/90 border-white/30 shadow-lg'
                      : 'glass-subtle hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: t.swatch }}
                    />
                    {active && <Check className="w-4 h-4 text-zinc-100" />}
                  </div>
                  <p className="text-xs font-semibold text-zinc-100">{t.name}</p>
                  <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">{t.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Board Theme */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Chessboard Surface
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {BOARD_THEMES.map((b) => {
              const active = boardTheme === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBoardTheme(b.id)}
                  className={`p-2.5 rounded-2xl flex items-center gap-3 text-left transition border ${
                    active
                      ? 'bg-zinc-900/90 border-white/30 shadow-lg'
                      : 'glass-subtle hover:border-white/15'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden grid grid-cols-2 grid-rows-2 border border-white/15 shrink-0">
                    <div style={{ backgroundColor: b.lightSquare }} />
                    <div style={{ backgroundColor: b.darkSquare }} />
                    <div style={{ backgroundColor: b.darkSquare }} />
                    <div style={{ backgroundColor: b.lightSquare }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-100 truncate">{b.name}</p>
                    {active && <p className="text-[10px] text-zinc-400">Active</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound Effects Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="w-full p-3.5 rounded-2xl glass-subtle hover:border-white/15 flex items-center justify-between transition"
        >
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-zinc-100" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-100">Board Sound Effects</p>
              <p className="text-[10px] text-zinc-400">
                Wood move thuds, captures, checks &amp; mate chord
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase ${
              soundEnabled
                ? 'bg-zinc-100 text-zinc-950'
                : 'bg-zinc-900 text-zinc-500 border border-white/10'
            }`}
          >
            {soundEnabled ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </div>
  );
};
