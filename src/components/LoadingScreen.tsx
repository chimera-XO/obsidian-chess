import React from 'react';

interface LoadingScreenProps {
  fadingOut?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ fadingOut = false }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] px-6 select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(244, 244, 245, 0.06) 0%, rgba(9, 9, 11, 0) 60%)',
        }}
      />

      {/* Animated Piece Stage */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Impact burst rays behind the shaking knight */}
        <svg
          viewBox="0 0 220 220"
          className="anim-burst-rays absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <g stroke="rgba(254, 243, 199, 0.55)" strokeWidth="1.75" strokeLinecap="round">
            <line x1="110" y1="34" x2="110" y2="52" />
            <line x1="110" y1="168" x2="110" y2="186" />
            <line x1="34" y1="110" x2="52" y2="110" />
            <line x1="168" y1="110" x2="186" y2="110" />
            <line x1="56" y1="56" x2="70" y2="70" />
            <line x1="150" y1="150" x2="164" y2="164" />
            <line x1="164" y1="56" x2="150" y2="70" />
            <line x1="70" y1="150" x2="56" y2="164" />
            <line x1="82" y1="40" x2="88" y2="55" stroke="rgba(244,244,245,0.35)" />
            <line x1="138" y1="40" x2="132" y2="55" stroke="rgba(244,244,245,0.35)" />
            <line x1="40" y1="84" x2="55" y2="90" stroke="rgba(244,244,245,0.35)" />
            <line x1="180" y1="84" x2="165" y2="90" stroke="rgba(244,244,245,0.35)" />
            <line x1="40" y1="136" x2="55" y2="130" stroke="rgba(244,244,245,0.35)" />
            <line x1="180" y1="136" x2="165" y2="130" stroke="rgba(244,244,245,0.35)" />
          </g>
        </svg>

        {/* 2. BISHOP — emerges on L-shape knight move (+1, +2) */}
        <div className="anim-piece-bishop absolute w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]">
            <defs>
              <linearGradient id="obsidianPiece" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f4f4f5" />
                <stop offset="48%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#27272a" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="11" r="4" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.6" />
            <path
              d="M32 15c-7 5-11 12-9 20 1.2 4.5 4 7 4 9h10c0-2 2.8-4.5 4-9 2-8-2-15-9-20z"
              fill="url(#obsidianPiece)"
              stroke="#09090b"
              strokeWidth="1.8"
            />
            <path d="M27 24l10 8" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" />
            <rect x="21" y="45" width="22" height="5" rx="2.5" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.6" />
            <path d="M17 55c0-3 4-5 15-5s15 2 15 5H17z" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.8" />
          </svg>
        </div>

        {/* 3. ROOK — emerges on L-shape knight move (-2, +1) */}
        <div className="anim-piece-rook absolute w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]">
            <path
              d="M19 14h6v5h4v-5h6v5h4v-5h6v11l-4 4v15l4 4v6H19v-6l4-4V29l-4-4V14z"
              fill="url(#obsidianPiece)"
              stroke="#09090b"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <rect x="16" y="51" width="32" height="5" rx="2" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.6" />
          </svg>
        </div>

        {/* 4. QUEEN — emerges on L-shape knight move (-1, -2) */}
        <div className="anim-piece-queen absolute w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]">
            <circle cx="14" cy="18" r="3" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.4" />
            <circle cx="23" cy="13" r="3" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.4" />
            <circle cx="32" cy="11" r="3.2" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.4" />
            <circle cx="41" cy="13" r="3" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.4" />
            <circle cx="50" cy="18" r="3" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.4" />
            <path
              d="M15 21l6 22h22l6-22-9 11-8-17-8 17-9-11z"
              fill="url(#obsidianPiece)"
              stroke="#09090b"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <rect x="19" y="44" width="26" height="5" rx="2" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.6" />
            <path d="M16 55c0-3.5 4.5-5.5 16-5.5S48 51.5 48 55H16z" fill="url(#obsidianPiece)" stroke="#09090b" strokeWidth="1.8" />
          </svg>
        </div>

        {/* 5. KING — emerges last on L-shape knight move (+2, -1) with golden glow + sparkles */}
        <div className="anim-piece-king absolute w-[70px] h-[70px] flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="kingGlowGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#d4b483" />
              </linearGradient>
            </defs>
            {/* Cross */}
            <path d="M32 6v10M27 11h10" stroke="#fef3c7" strokeWidth="3.2" strokeLinecap="round" />
            {/* Crown / Body */}
            <path
              d="M20 26c0-5 5.5-8 12-8s12 3 12 8c0 6-4 12-6 17H26c-2-5-6-11-6-17z"
              fill="url(#kingGlowGrad)"
              stroke="#18181b"
              strokeWidth="1.6"
            />
            <rect x="19" y="43" width="26" height="5" rx="2.5" fill="url(#kingGlowGrad)" stroke="#18181b" strokeWidth="1.5" />
            <path d="M16 55c0-3.5 4.5-6 16-6s16 2.5 16 6H16z" fill="url(#kingGlowGrad)" stroke="#18181b" strokeWidth="1.6" />
          </svg>

          {/* Sparkles around the glowing King */}
          <svg
            viewBox="0 0 24 24"
            className="anim-sparkle-1 absolute -top-2 -right-2 w-4 h-4 text-amber-100"
            fill="currentColor"
          >
            <path d="M12 0l2.8 9.2L24 12l-9.2 2.8L12 24l-2.8-9.2L0 12l9.2-2.8z" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className="anim-sparkle-2 absolute -bottom-1 -left-2 w-3.5 h-3.5 text-amber-200"
            fill="currentColor"
          >
            <path d="M12 0l2.8 9.2L24 12l-9.2 2.8L12 24l-2.8-9.2L0 12l9.2-2.8z" />
          </svg>
        </div>

        {/* 1. CENTER KNIGHT — slams in first and shakes aggressively */}
        <div className="anim-knight-wrapper relative z-10 w-24 h-24 flex items-center justify-center">
          <div className="anim-knight-shake w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.95)]">
              <defs>
                <linearGradient id="knightMetallic" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fafafa" />
                  <stop offset="45%" stopColor="#a1a1aa" />
                  <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
              </defs>
              {/* Horse head & mane */}
              <path
                d="M48 15l-4-5-3 6c-7 1-14 6-18 14-3 6-4 10-2 13 2 2 6 1 9-1 3-2 6-4 8-3 1 1-1 6-6 11-3 3-6 6-7 10h32c0-7-2-14-1-22 1-9 0-17-8-23z"
                fill="url(#knightMetallic)"
                stroke="#09090b"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Eye & bridle accent */}
              <circle cx="31" cy="28" r="2" fill="#09090b" />
              <path d="M46 21c4 5 5 13 3 23" fill="none" stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
              {/* Pedestal */}
              <rect x="21" y="60" width="38" height="6" rx="3" fill="url(#knightMetallic)" stroke="#09090b" strokeWidth="2" />
              <path
                d="M17 72c0-4 6-6 23-6s23 2 23 6H17z"
                fill="url(#knightMetallic)"
                stroke="#09090b"
                strokeWidth="2.2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Title & Status */}
      <div className="mt-6 text-center space-y-2">
        <h1 className="text-xl font-bold tracking-[0.2em] text-zinc-100 uppercase">
          Obsidian Chess
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
          <span>Preparing grandmaster workspace...</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
        </div>
      </div>
    </div>
  );
};
