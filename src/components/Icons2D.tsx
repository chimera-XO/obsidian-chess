import React from 'react';

interface IconProps {
  className?: string;
}

export const RapidIcon2D: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect x="12" y="3" width="8" height="3" rx="1.5" fill="#a1a1aa" />
    <circle cx="16" cy="18" r="10.5" fill="#10b981" />
    <circle cx="16" cy="18" r="7.5" fill="#064e3b" />
    <path d="M16 18V12.5" stroke="#ecfdf5" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M16 18L20 20.5" stroke="#6ee7b7" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="18" r="1.8" fill="#ecfdf5" />
  </svg>
);

export const BlitzIcon2D: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path
      d="M18.5 3L7 17.5H15L13.5 29L25 14.5H17L18.5 3Z"
      fill="#e4e4e7"
      stroke="#18181b"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M17.5 6.5L11 15.5H16.2L15.2 24.5L21.5 16H16.3L17.5 6.5Z" fill="#ffffff" />
  </svg>
);

export const BulletIcon2D: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M5 13H11V19H5V13Z" fill="#7f1d1d" />
    <path d="M11 11H19C23.5 11 27 13.2 27 16C27 18.8 23.5 21 19 21H11V11Z" fill="#ef4444" />
    <path d="M13 13.5H19C21.5 13.5 23.5 14.5 23.5 15.5H13V13.5Z" fill="#fca5a5" opacity="0.7" />
    <rect x="9.5" y="11" width="2" height="10" fill="#18181b" />
  </svg>
);

export const PuzzleIcon2D: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path
      d="M13 6C13 4.3 14.3 3 16 3C17.7 3 19 4.3 19 6V8H24C25.1 8 26 8.9 26 10V15H24C22.3 15 21 16.3 21 18C21 19.7 22.3 21 24 21H26V26C26 27.1 25.1 28 24 28H19V26C19 24.3 17.7 23 16 23C14.3 23 13 24.3 13 26V28H8C6.9 28 6 27.1 6 26V21H8C9.7 21 11 19.7 11 18C11 16.3 9.7 15 8 15H6V10C6 8.9 6.9 8 8 8H13V6Z"
      fill="#38bdf8"
    />
    <path d="M8 10H14V12H10V14H8V10Z" fill="#bae6fd" opacity="0.65" />
  </svg>
);

export const StreakFlame2D: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M12.8 2.2C13.6 6.2 18 8.3 18 13.5C18 17.4 15.3 20.5 12 20.5C8.7 20.5 6 17.4 6 13.5C6 10.6 7.5 8.1 9.5 6.8C9.2 8.7 10.2 9.8 11.2 10.2C10.8 7.5 11.4 4.5 12.8 2.2Z"
      fill="#ef4444"
    />
    <path
      d="M12.2 11.5C13.5 13 14.5 14.3 14.5 16.2C14.5 17.9 13.4 19.2 12 19.2C10.6 19.2 9.5 17.9 9.5 16.2C9.5 14.6 10.7 13.1 12.2 11.5Z"
      fill="#fca5a5"
    />
  </svg>
);

export const RankShield2D: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M12 2.5L20 5.8V12.2C20 16.8 16.6 20.3 12 21.8C7.4 20.3 4 16.8 4 12.2V5.8L12 2.5Z" fill="#3f3f46" />
    <path d="M12 4.5L18 7V12.1C18 15.6 15.4 18.4 12 19.7V4.5Z" fill="#71717a" />
    <path d="M12 8L13.3 10.7L16.2 11.1L14.1 13.1L14.6 16L12 14.6L9.4 16L9.9 13.1L7.8 11.1L10.7 10.7L12 8Z" fill="#f4f4f5" />
  </svg>
);

export const Moon2D: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M19.5 14.8A8 8 0 0 1 9.2 4.5A8.2 8.2 0 1 0 19.5 14.8Z"
      fill="#e4e4e7"
    />
  </svg>
);

export const Sun2D: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="5" fill="#e4e4e7" />
    <g stroke="#a1a1aa" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="2.5" x2="12" y2="4.8" />
      <line x1="12" y1="19.2" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="4.8" y2="12" />
      <line x1="19.2" y1="12" x2="21.5" y2="12" />
      <line x1="5.3" y1="5.3" x2="6.9" y2="6.9" />
      <line x1="17.1" y1="17.1" x2="18.7" y2="18.7" />
      <line x1="18.7" y1="5.3" x2="17.1" y2="6.9" />
      <line x1="6.9" y1="17.1" x2="5.3" y2="18.7" />
    </g>
  </svg>
);

export const PlayKnight2D: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M15.2 4.2L13.8 2.5L12.8 4.6C10.2 5 7.8 6.8 6.5 9.5C5.6 11.4 5.4 12.8 6.1 13.6C6.8 14.3 8.1 14 9.2 13.3C10.2 12.6 11 12.2 11.5 12.5C11.8 12.8 11.1 14.4 9.4 16C8.3 17 7.3 18 7 19.2H17.5C17.5 16.9 16.9 14.6 17.2 12C17.5 9 17.3 6.2 15.2 4.2Z"
      fill="currentColor"
    />
    <rect x="6" y="19.5" width="12" height="2.5" rx="1.2" fill="currentColor" />
  </svg>
);

export const Mic2D: React.FC<IconProps> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="8.5" y="3" width="7" height="11" rx="3.5" fill="#f4f4f5" />
    <path d="M5.5 11.5C5.5 15.1 8.4 18 12 18C15.6 18 18.5 15.1 18.5 11.5" stroke="#a1a1aa" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M12 18V21.5M9 21.5H15" stroke="#a1a1aa" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 2D Flat Bottom Navigation Icons
export const HomeNav2D: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M12 3L3.5 10.2V20.5C3.5 21.1 4 21.5 4.5 21.5H9.5V15H14.5V21.5H19.5C20 21.5 20.5 21.1 20.5 20.5V10.2L12 3Z" fill="currentColor" />
  </svg>
);

export const PuzzlesNav2D: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M10 4.5C10 3.4 10.9 2.5 12 2.5C13.1 2.5 14 3.4 14 4.5V6H18.5C19.3 6 20 6.7 20 7.5V11H18.5C17.4 11 16.5 11.9 16.5 13C16.5 14.1 17.4 15 18.5 15H20V19.5C20 20.3 19.3 21 18.5 21H14V19.5C14 18.4 13.1 17.5 12 17.5C10.9 17.5 10 18.4 10 19.5V21H5.5C4.7 21 4 20.3 4 19.5V15H5.5C6.6 15 7.5 14.1 7.5 13C7.5 11.9 6.6 11 5.5 11H4V7.5C4 6.7 4.7 6 5.5 6H10V4.5Z"
      fill="currentColor"
    />
  </svg>
);

export const AnalyzeNav2D: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="#09090b" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="9" y1="2.5" x2="9" y2="5" />
      <line x1="15" y1="2.5" x2="15" y2="5" />
      <line x1="9" y1="19" x2="9" y2="21.5" />
      <line x1="15" y1="19" x2="15" y2="21.5" />
      <line x1="2.5" y1="9" x2="5" y2="9" />
      <line x1="2.5" y1="15" x2="5" y2="15" />
      <line x1="19" y1="9" x2="21.5" y2="9" />
      <line x1="19" y1="15" x2="21.5" y2="15" />
    </g>
  </svg>
);

export const HistoryNav2D: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="9" fill="currentColor" />
    <path d="M12 7.5V12.2L15.2 14.2" stroke="#09090b" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FriendsNav2D: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="9.2" cy="8.2" r="3.4" fill="currentColor" />
    <path d="M3.2 19.2C3.2 15.8 5.9 13.5 9.2 13.5C12.5 13.5 15.2 15.8 15.2 19.2V20.5H3.2V19.2Z" fill="currentColor" />
    <circle cx="16.5" cy="9.2" r="2.6" fill="currentColor" opacity="0.72" />
    <path d="M15.4 13.9C18.2 14.1 20.8 16 20.8 19.2V20.5H16.5V19.2C16.5 17 16.1 15.2 15.4 13.9Z" fill="currentColor" opacity="0.72" />
  </svg>
);
