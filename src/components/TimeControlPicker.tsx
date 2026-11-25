import React from 'react';
import { Zap, Flame, Clock, Infinity as InfinityIcon } from 'lucide-react';
import { TIME_CONTROLS } from '../constants/timeControls';
import type { TimeCategory, TimeControl } from '../types/chess';

interface TimeControlPickerProps {
  selected: TimeControl;
  onSelect: (tc: TimeControl) => void;
  disabled?: boolean;
}

const GROUPS: { id: TimeCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'bullet', label: 'Bullet', icon: Zap },
  { id: 'blitz', label: 'Blitz', icon: Flame },
  { id: 'rapid', label: 'Rapid', icon: Clock },
  { id: 'untimed', label: 'Untimed', icon: InfinityIcon },
];

export const TimeControlPicker: React.FC<TimeControlPickerProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">Time Control</span>
        <span className="font-mono text-[11px] text-zinc-200">{selected.label}</span>
      </div>

      <div className="space-y-2">
        {GROUPS.map(({ id, label, icon: Icon }) => {
          const items = TIME_CONTROLS.filter((t) => t.category === id);
          return (
            <div key={id} className="flex items-center gap-2">
              <div className="w-16 flex items-center gap-1 text-[11px] text-zinc-500 shrink-0">
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {items.map((tc) => {
                  const isActive = selected.id === tc.id;
                  return (
                    <button
                      key={tc.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelect(tc)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-medium transition disabled:opacity-40 ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                          : 'glass-subtle text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {tc.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
