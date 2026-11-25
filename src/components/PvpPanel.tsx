import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Flag,
  Handshake,
  RotateCcw,
  LogOut,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { TimeControlPicker } from './TimeControlPicker';
import { MoveHistoryNavigator } from './MoveHistoryNavigator';
import type { ChessRoomRow, TimeControl } from '../types/chess';

interface PvpPanelProps {
  username: string;
  room: ChessRoomRow | null;
  myColor: 'w' | 'b' | 'spectator' | null;
  isOpponentOnline: boolean;
  loading: boolean;
  error: string | null;
  selectedTimeControl: TimeControl;
  onSelectTimeControl: (tc: TimeControl) => void;
  onCreateRoom: (side: 'w' | 'b' | 'random', tc: TimeControl) => void;
  onJoinRoom: (code: string) => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onRespondDraw: (accept: boolean) => void;
  onRematch: () => void;
  onLeaveRoom: () => void;
  onReviewInAnalysis: () => void;
  pvpViewPly: number;
  onChangePvpPly: (ply: number) => void;
}

export const PvpPanel: React.FC<PvpPanelProps> = ({
  username,
  room,
  myColor,
  isOpponentOnline,
  loading,
  error,
  selectedTimeControl,
  onSelectTimeControl,
  onCreateRoom,
  onJoinRoom,
  onResign,
  onOfferDraw,
  onRespondDraw,
  onRematch,
  onLeaveRoom,
  onReviewInAnalysis,
  pvpViewPly,
  onChangePvpPly,
}) => {
  const [joinCode, setJoinCode] = useState('');
  const [preferredSide, setPreferredSide] = useState<'w' | 'b' | 'random'>('random');
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = () => {
    if (!room) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${room.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!room) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/5">
          <span className="text-zinc-400">Playing as</span>
          <span className="font-mono font-medium text-zinc-100">@{username}</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400">Join Room by Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. K7P9X2"
              maxLength={8}
              className="flex-1 bg-zinc-950/80 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-widest text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              disabled={loading || !joinCode.trim()}
              onClick={() => onJoinRoom(joinCode)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 transition"
            >
              Join
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Side</span>
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
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <TimeControlPicker
            selected={selectedTimeControl}
            onSelect={onSelectTimeControl}
            disabled={loading}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => onCreateRoom(preferredSide, selectedTimeControl)}
            className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Users className="w-4 h-4" />
            {loading ? 'Creating Room...' : 'Create PvP Room'}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  const incomingDrawOffer =
    room.status === 'active' &&
    room.draw_offer_by &&
    myColor &&
    myColor !== 'spectator' &&
    room.draw_offer_by !== myColor;

  const outgoingDrawOffer =
    room.status === 'active' &&
    room.draw_offer_by &&
    room.draw_offer_by === myColor;

  const resultLabel =
    room.status === 'finished'
      ? room.winner === 'draw'
        ? `Draw (${room.end_reason || 'draw'})`
        : `${room.winner === 'w' ? 'White' : 'Black'} wins by ${room.end_reason || 'checkmate'}`
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-widest text-zinc-100">
              {room.code}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 font-mono">
              {room.time_control_label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
            {room.status === 'waiting' ? (
              <span>Waiting for opponent to join...</span>
            ) : isOpponentOnline ? (
              <>
                <Wifi className="w-3 h-3 text-zinc-200" />
                <span>Opponent online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-zinc-500" />
                <span>Opponent away</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyInvite}
          className="px-3 py-1.5 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-200 flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Invite Link'}
        </button>
      </div>

      {incomingDrawOffer && (
        <div className="bg-zinc-900/90 border border-white/15 rounded-xl p-3 flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-200">Opponent offered a draw</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onRespondDraw(true)}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-semibold"
            >
              Accept
            </button>
            <button
              onClick={() => onRespondDraw(false)}
              className="px-2.5 py-1 rounded-lg glass-subtle text-zinc-300 text-xs"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {resultLabel && (
        <div className="bg-zinc-900/95 border border-white/15 rounded-xl p-3.5 space-y-2.5">
          <p className="text-sm font-semibold text-zinc-100 text-center">{resultLabel}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRematch}
              className="py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rematch
            </button>
            <button
              onClick={onReviewInAnalysis}
              className="py-2 rounded-lg glass-subtle hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Review w/ Coach
            </button>
          </div>
        </div>
      )}

      {room.status === 'active' && (myColor === 'w' || myColor === 'b') && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={Boolean(outgoingDrawOffer)}
            onClick={onOfferDraw}
            className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 flex items-center justify-center gap-1.5"
          >
            <Handshake className="w-3.5 h-3.5" />
            {outgoingDrawOffer ? 'Draw Offered' : 'Offer Draw'}
          </button>
          <button
            type="button"
            onClick={onResign}
            className="py-2 rounded-lg text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5" />
            Resign
          </button>
        </div>
      )}

      <MoveHistoryNavigator
        moves={room.moves || []}
        viewPly={pvpViewPly}
        onChangePly={onChangePvpPly}
      />

      {error && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onLeaveRoom}
        className="w-full py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 glass-subtle flex items-center justify-center gap-1.5"
      >
        <LogOut className="w-3.5 h-3.5" />
        Leave Room
      </button>
    </div>
  );
};
