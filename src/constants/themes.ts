export type UiThemeId = 'obsidian' | 'crimson';
export type BoardThemeId = 'obsidian' | 'crimson-walnut' | 'emerald-club' | 'slate-steel';

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
    id: 'obsidian',
    name: 'Dark Obsidian',
    subtitle: 'Pure monochrome glass & silver trim',
    swatch: '#27272a',
  },
  {
    id: 'crimson',
    name: 'Crimson Obsidian',
    subtitle: 'Dark red glass & ruby specular trim',
    swatch: '#991b1b',
  },
];

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'obsidian',
    name: 'Obsidian & Ash',
    darkSquare: '#232329',
    lightSquare: '#52525c',
    lastMoveFrom: 'rgba(244, 244, 245, 0.16)',
    lastMoveTo: 'rgba(244, 244, 245, 0.28)',
    selectedSquare: 'rgba(244, 244, 245, 0.24)',
  },
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
    id: 'emerald-club',
    name: 'Emerald Club',
    darkSquare: '#1f3a2e',
    lightSquare: '#6d7f73',
    lastMoveFrom: 'rgba(110, 231, 183, 0.22)',
    lastMoveTo: 'rgba(110, 231, 183, 0.36)',
    selectedSquare: 'rgba(209, 250, 229, 0.25)',
  },
  {
    id: 'slate-steel',
    name: 'Slate Steel',
    darkSquare: '#1e293b',
    lightSquare: '#64748b',
    lastMoveFrom: 'rgba(148, 163, 184, 0.28)',
    lastMoveTo: 'rgba(226, 232, 240, 0.36)',
    selectedSquare: 'rgba(226, 232, 240, 0.26)',
  },
];

export function getBoardTheme(id: BoardThemeId): BoardTheme {
  return BOARD_THEMES.find((b) => b.id === id) || BOARD_THEMES[0];
}
