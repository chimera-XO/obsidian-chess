import React, { useState } from 'react';
import { ArrowLeft, Bot, Users, UserCheck, ChevronRight, Swords } from 'lucide-react';
import { TimeControlPicker } from './TimeControlPicker';
import type { TimeControl } from '../types/chess';

type PlayChoice = null | 'bot' | 'pvp' | 'self';

interface PlaySetupFlowProps {
  skillLevel: number;
  onChangeSkillLevel: (lvl: number) => void;
  timeControl: TimeControl;
  onChangeTimeControl: (tc: TimeControl) => void;
  pvpLoading: boolean;
  pvpError: string | null;
  onStartBot: () => void;
  onStartSelf: () => void;
  onCreatePvp: (side: 'w' | 'b' | 'random', tc: TimeControl) => void;
  onJoinPvp: (code: string) => void;
  onBack: () => void;
}

export const PlaySetupFlow: React.FC<PlaySetupFlowProps> = ({
  skillLevel,
  onChangeSkillLevel,
  timeControl,
  onChangeTimeControl,
  pvpLoading,
  pvpError,
  onStartBot,
  onStartSelf,
  onCreatePvp,
  onJoinPvp,
  onBack,
}) => {
  const [choice, setChoice] = useState<PlayChoice>(null);
  const [pvpTab, setPvpTab] = useState<'create' | 'join'>('create');
  const [preferredSide, setPreferredSide] = useState<'w' | 'b' | 'random'>('random');
  const [joinCode, setJoinCode] = useState('');

  const handleHeaderBack = () => {
    if (choice !== null) {
      setChoice(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleHeaderBack}
          className="p-2 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            {choice === null
              ? 'New Game'
              : choice === 'bot'
              ? 'Play vs Bot'
              : choice === 'pvp'
              ? 'Play PvP Room'
              : 'Play vs Self'}
          </h2>
          <p className="text-xs text-zinc-400">
            {choice === null
              ? 'Choose how you want to play'
              : choice === 'bot'
              ? 'Set Stockfish level & time control'
              : choice === 'pvp'
              ? 'Create an invite link or join by code'
              : 'Local pass-and-play on one board'}
          </p>
        </div>
      </div>

      {/* Step 1: Select Opponent Mode */}
      {choice === null && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setChoice('bot')}
            className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">Play Bot</p>
                <p className="text-xs text-zinc-400">Challenge Stockfish from Level 0 to 20</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={() => setChoice('pvp')}
            className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">Play PvP</p>
                <p className="text-xs text-zinc-400">Create a room link or join a friend</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={() => setChoice('self')}
            className="w-full glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">Play vs Self</p>
                <p className="text-xs text-zinc-400">Pass &amp; play both sides on this device</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      )}

      {/* Step 2A: Bot Setup */}
      {choice === 'bot' && (
        <div className="glass-panel rounded-2xl p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-zinc-400">Stockfish Level</span>
              <span className="font-mono font-semibold text-zinc-100">{skillLevel} / 20</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={skillLevel}
              onChange={(e) => onChangeSkillLevel(Number(e.target.value))}
              className="w-full accent-zinc-200"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>Beginner (0)</span>
              <span>Club (10)</span>
              <span>GM (20)</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <TimeControlPicker selected={timeControl} onSelect={onChangeTimeControl} />
          </div>

          <button
            type="button"
            onClick={onStartBot}
            className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Swords className="w-4 h-4" />
            Start Bot Game
          </button>
        </div>
      )}

      {/* Step 2B: PvP Setup */}
      {choice === 'pvp' && (
        <div className="glass-panel rounded-2xl p-5 space-y-5">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950/80 border border-white/5">
            <button
              type="button"
              onClick={() => setPvpTab('create')}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                pvpTab === 'create'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Room
            </button>
            <button
              type="button"
              onClick={() => setPvpTab('join')}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                pvpTab === 'join'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Join by Code
            </button>
          </div>

          {pvpTab === 'create' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Your Side</span>
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                  {(
                    [
                      { id: 'w', label: 'White' },
                      { id: 'random', label: 'Random' },
                      { id: 'b', label: 'Black' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferredSide(opt.id)}
                      className={`px-3 py-1.5 text-xs font-medium transition ${
                        preferredSide === opt.id
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <TimeControlPicker
                selected={timeControl}
                onSelect={onChangeTimeControl}
                disabled={pvpLoading}
              />

              <button
                type="button"
                disabled={pvpLoading}
                onClick={() => onCreatePvp(preferredSide, timeControl)}
                className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
              >
                <Users className="w-4 h-4" />
                {pvpLoading ? 'Creating Room...' : 'Create Room & Invite Link'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">6-Character Room Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. K7P9X2"
                  maxLength={8}
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-sm uppercase tracking-widest text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <button
                type="button"
                disabled={pvpLoading || !joinCode.trim()}
                onClick={() => onJoinPvp(joinCode)}
                className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-950 font-semibold text-sm transition"
              >
                {pvpLoading ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          )}

          {pvpError && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl px-3 py-2">
              {pvpError}
            </p>
          )}
        </div>
      )}

      {/* Step 2C: Play vs Self Setup */}
      {choice === 'self' && (
        <div className="glass-panel rounded-2xl p-5 space-y-5">
          <TimeControlPicker selected={timeControl} onSelect={onChangeTimeControl} />

          <button
            type="button"
            onClick={onStartSelf}
            className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
          >
            <UserCheck className="w-4 h-4" />
            Start Pass &amp; Play
          </button>
        </div>
      )}
    </div>
  );
};
