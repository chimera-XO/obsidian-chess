export type UiThemeId = 'crimson' | 'gold';
export type BoardThemeId = 'obsidian' | 'crimson-walnut' | 'emerald-club' | 'warm-marble';

export interface UiTheme {
  id: UiThemeId;
  name: string;
  subtitle: string;
  swatch: string;
}

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  darkSquare: string;
  lightSquare: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  selectedSquare: string;
}

export const UI_THEMES: UiTheme[] = [
  {
    id: 'crimson',
    name: 'Crimson Obsidian',
    subtitle: 'Dark red glass & ruby specular trim',
    swatch: '#991b1b',
  },
  {
    id: 'gold',
    name: 'Grandmaster Gold',
    subtitle: 'Matte obsidian & champagne gold',
    swatch: '#c8a464',
  },
];

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'crimson-walnut',
    name: 'Crimson Walnut',
    darkSquare: '#3b181b',
    lightSquare: '#7a5c58',
    lastMoveFrom: 'rgba(239, 68, 68, 0.28)',
    lastMoveTo: 'rgba(239, 68, 68, 0.42)',
    selectedSquare: 'rgba(254, 202, 202, 0.28)',
  },
  {
    id: 'obsidian',
    name: 'Obsidian & Ash',
    darkSquare: '#232329',
    lightSquare: '#52525c',
    lastMoveFrom: 'rgba(220, 38, 38, 0.24)',
    lastMoveTo: 'rgba(220, 38, 38, 0.38)',
    selectedSquare: 'rgba(244, 244, 245, 0.24)',
  },
  {
    id: 'emerald-club',
    name: 'Emerald Club',
    darkSquare: '#1f3a2e',
    lightSquare: '#6d7f73',
    lastMoveFrom: 'rgba(212, 180, 131, 0.28)',
    lastMoveTo: 'rgba(212, 180, 131, 0.44)',
    selectedSquare: 'rgba(254, 243, 199, 0.26)',
  },
  {
    id: 'warm-marble',
    name: 'Warm Marble',
    darkSquare: '#3d342c',
    lightSquare: '#8c7d6d',
    lastMoveFrom: 'rgba(217, 179, 108, 0.28)',
    lastMoveTo: 'rgba(217, 179, 108, 0.45)',
    selectedSquare: 'rgba(254, 243, 199, 0.28)',
  },
];

export function getBoardTheme(id: BoardThemeId): BoardTheme {
  return BOARD_THEMES.find((b) => b.id === id) || BOARD_THEMES[0];
}
