import type { Square } from 'chess.js';

export type BottomTab = 'home' | 'puzzles' | 'analyze' | 'history' | 'friends';

export type ActiveView =
  | 'tab'
  | 'play-setup'
  | 'game-bot'
  | 'game-pvp'
  | 'game-self'
  | 'analyze-board'
  | 'analyze-editor'
  | 'analyze-import';

export type BoardArrow = [Square, Square, string?];

export type TimeCategory = 'bullet' | 'blitz' | 'rapid' | 'untimed';

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

export interface ChessPuzzle {
  id: string;
  title: string;
  theme: string;
  difficulty: PuzzleDifficulty;
  fen: string;
  solution: string[];
  hint: string;
}

export interface TimeControl {
  id: string;
  label: string;
  shortLabel: string;
  category: TimeCategory;
  baseMs: number;
  incrementMs: number;
}

export interface StockfishAnalysis {
  depth: number;
  cp: number | null;
  mate: number | null;
  pv: string[];
  bestMove: string | null;
  isThinking: boolean;
}

export interface BoardSnapshot {
  fen: string;
  turn: 'White' | 'Black';
  inCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  moveHistorySan: string[];
  piecesSummary: string;
  asciiBoard: string;
  legalMoves: string[];
  stockfishEval: string;
  stockfishDepth: number;
  bestLineUci: string[];
  bestLineSan: string[];
  puzzleContext?: {
    title: string;
    theme: string;
    difficulty: PuzzleDifficulty;
    hint: string;
    expectedNextMoveUci: string | null;
    solved: boolean;
  };
}

export interface TranscriptEntry {
  id: string;
  role: 'coach' | 'system';
  text: string;
  timestamp: string;
}

export interface ChessRoomRow {
  id: string;
  code: string;
  fen: string;
  moves: string[];
  turn: 'w' | 'b';
  status: 'waiting' | 'active' | 'finished';
  winner: 'w' | 'b' | 'draw' | null;
  end_reason: string | null;
  draw_offer_by: 'w' | 'b' | null;
  white_player_id: string | null;
  white_player_name: string | null;
  black_player_id: string | null;
  black_player_name: string | null;
  time_control_id: string;
  time_control_label: string;
  base_time_ms: number;
  increment_ms: number;
  white_time_ms: number;
  black_time_ms: number;
  last_move_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameHistoryEntry {
  id: string;
  user_id: string;
  mode: 'play' | 'pvp';
  opponent_name: string;
  player_color: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  end_reason: string;
  time_control_label: string;
  moves: string[];
  final_fen: string;
  created_at: string;
}
