import type { TimeControl } from '../types/chess';

export const TIME_CONTROLS: TimeControl[] = [
  { id: 'bullet-1-0', label: '1+0 Bullet', shortLabel: '1+0', category: 'bullet', baseMs: 60_000, incrementMs: 0 },
  { id: 'bullet-1-1', label: '1+1 Bullet', shortLabel: '1+1', category: 'bullet', baseMs: 60_000, incrementMs: 1_000 },
  { id: 'bullet-2-1', label: '2+1 Bullet', shortLabel: '2+1', category: 'bullet', baseMs: 120_000, incrementMs: 1_000 },
  { id: 'blitz-3-0', label: '3+0 Blitz', shortLabel: '3+0', category: 'blitz', baseMs: 180_000, incrementMs: 0 },
  { id: 'blitz-3-2', label: '3+2 Blitz', shortLabel: '3+2', category: 'blitz', baseMs: 180_000, incrementMs: 2_000 },
  { id: 'blitz-5-0', label: '5+0 Blitz', shortLabel: '5+0', category: 'blitz', baseMs: 300_000, incrementMs: 0 },
  { id: 'blitz-5-3', label: '5+3 Blitz', shortLabel: '5+3', category: 'blitz', baseMs: 300_000, incrementMs: 3_000 },
  { id: 'rapid-10-0', label: '10+0 Rapid', shortLabel: '10+0', category: 'rapid', baseMs: 600_000, incrementMs: 0 },
  { id: 'rapid-10-5', label: '10+5 Rapid', shortLabel: '10+5', category: 'rapid', baseMs: 600_000, incrementMs: 5_000 },
  { id: 'rapid-15-10', label: '15+10 Rapid', shortLabel: '15+10', category: 'rapid', baseMs: 900_000, incrementMs: 10_000 },
  { id: 'untimed', label: 'Untimed', shortLabel: '∞', category: 'untimed', baseMs: 0, incrementMs: 0 },
];

export const DEFAULT_TIME_CONTROL = TIME_CONTROLS.find((t) => t.id === 'blitz-3-2')!;

export function formatClockMs(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (clamped < 20_000) {
    const tenths = Math.floor((clamped % 1000) / 100);
    return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
