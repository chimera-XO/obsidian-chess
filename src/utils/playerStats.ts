import type { GameHistoryEntry } from '../types/chess';

export interface ModeRating {
  id: 'rapid' | 'blitz' | 'bullet' | 'puzzles';
  label: string;
  rating: number;
  delta: number; // positive = up, negative = down, 0 = neutral
  gamesPlayed: number;
}

export interface PlayerProgress {
  streak: number;
  rankTitle: string;
  ratings: ModeRating[];
}

const STREAK_KEY = 'obsidian_daily_streak_v1';

export function getTimeGreeting(): { text: string; period: 'morning' | 'afternoon' | 'evening' } {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', period: 'morning' };
  if (h < 18) return { text: 'Good afternoon', period: 'afternoon' };
  return { text: 'Good evening', period: 'evening' };
}

export function getOrUpdateDailyStreak(): number {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) {
      localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count: 1 }));
      return 1;
    }
    const parsed = JSON.parse(raw) as { lastDate: string; count: number };
    if (parsed.lastDate === today) return Math.max(1, parsed.count);

    const last = new Date(parsed.lastDate + 'T00:00:00Z');
    const now = new Date(today + 'T00:00:00Z');
    const diffDays = Math.round((now.getTime() - last.getTime()) / 86_400_000);
    const nextCount = diffDays === 1 ? parsed.count + 1 : 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count: nextCount }));
    return nextCount;
  } catch {
    return 1;
  }
}

function classifyMode(tcLabel: string): 'bullet' | 'blitz' | 'rapid' {
  const low = tcLabel.toLowerCase();
  if (low.includes('bullet') || low.startsWith('1+') || low.startsWith('2+')) return 'bullet';
  if (low.includes('blitz') || low.startsWith('3+') || low.startsWith('5+')) return 'blitz';
  return 'rapid';
}

export function computePlayerProgress(
  games: GameHistoryEntry[],
  solvedPuzzlesCount: number
): PlayerProgress {
  const streak = getOrUpdateDailyStreak();

  // Chronological order (oldest -> newest) for rating progression
  const sorted = [...games].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const buckets: Record<'rapid' | 'blitz' | 'bullet', { rating: number; lastDelta: number; count: number }> = {
    rapid: { rating: 400, lastDelta: 0, count: 0 },
    blitz: { rating: 400, lastDelta: 0, count: 0 },
    bullet: { rating: 400, lastDelta: 0, count: 0 },
  };

  for (const g of sorted) {
    const mode = classifyMode(g.time_control_label || 'Rapid');
    const b = buckets[mode];
    const delta = g.result === 'win' ? 16 : g.result === 'loss' ? -12 : 2;
    b.rating = Math.max(100, b.rating + delta);
    b.lastDelta = delta;
    b.count += 1;
  }

  const puzzleRating = 400 + solvedPuzzlesCount * 14;
  const puzzleDelta = solvedPuzzlesCount > 0 ? 14 : 0;

  const wins = games.filter((g) => g.result === 'win').length;
  const totalScore = wins * 3 + solvedPuzzlesCount * 2;
  const rankTitle =
    totalScore >= 80
      ? 'Grandmaster'
      : totalScore >= 40
      ? 'Master'
      : totalScore >= 18
      ? 'Tactician'
      : totalScore >= 6
      ? 'Club Player'
      : 'Initiate';

  return {
    streak,
    rankTitle,
    ratings: [
      { id: 'rapid', label: 'Rapid', rating: buckets.rapid.rating, delta: buckets.rapid.lastDelta, gamesPlayed: buckets.rapid.count },
      { id: 'blitz', label: 'Blitz', rating: buckets.blitz.rating, delta: buckets.blitz.lastDelta, gamesPlayed: buckets.blitz.count },
      { id: 'bullet', label: 'Bullet', rating: buckets.bullet.rating, delta: buckets.bullet.lastDelta, gamesPlayed: buckets.bullet.count },
      { id: 'puzzles', label: 'Puzzles', rating: puzzleRating, delta: puzzleDelta, gamesPlayed: solvedPuzzlesCount },
    ],
  };
}
