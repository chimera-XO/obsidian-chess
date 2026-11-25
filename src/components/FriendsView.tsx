import React from 'react';
import { Users, UserPlus, Swords } from 'lucide-react';

interface FriendsViewProps {
  username: string;
  onQuickPvp: () => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ username, onQuickPvp }) => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">Friends</h1>
        <p className="text-xs text-zinc-400">Your handle: @{username}</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 mx-auto flex items-center justify-center text-zinc-300">
          <Users className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-zinc-100">Friends List Coming Soon</h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Add friends by username, see who&apos;s online, and send instant game challenges directly from here in the next update.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="rounded-xl bg-zinc-950/60 border border-white/5 p-3 text-left space-y-1">
            <UserPlus className="w-4 h-4 text-zinc-400" />
            <p className="text-xs font-medium text-zinc-200">Add by @handle</p>
            <p className="text-[10px] text-zinc-500">Planned next</p>
          </div>
          <div className="rounded-xl bg-zinc-950/60 border border-white/5 p-3 text-left space-y-1">
            <Swords className="w-4 h-4 text-zinc-400" />
            <p className="text-xs font-medium text-zinc-200">1-Tap Challenge</p>
            <p className="text-[10px] text-zinc-500">Planned next</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onQuickPvp}
          className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition"
        >
          Play a Friend via Room Link Now
        </button>
      </div>
    </div>
  );
};
