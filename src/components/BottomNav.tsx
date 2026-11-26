import React from 'react';
import { Home, Puzzle, Cpu, History, Users } from 'lucide-react';
import type { BottomTab } from '../types/chess';

interface BottomNavProps {
  activeTab: BottomTab;
  onSelectTab: (tab: BottomTab) => void;
}

const ITEMS: {
  id: BottomTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'puzzles', label: 'Puzzles', icon: Puzzle },
  { id: 'analyze', label: 'Analyze', icon: Cpu },
  { id: 'history', label: 'History', icon: History },
  { id: 'friends', label: 'Friends', icon: Users },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-3 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <div className="max-w-lg mx-auto glass-dock rounded-2xl grid grid-cols-5 h-16 px-1.5 pointer-events-auto">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition ${
                isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isActive && (
                <span className="accent-dot absolute top-0 w-7 h-0.5 rounded-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
