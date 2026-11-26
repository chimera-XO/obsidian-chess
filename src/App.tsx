import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import {
  ArrowLeft,
  RotateCcw,
  StepForward,
  Sparkles,
  Flag,
  Handshake,
  Copy,
  Check,
  Wifi,
  WifiOff,
  Repeat,
  Palette,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useStockfish } from './hooks/useStockfish';
import { useGeminiLive } from './hooks/useGeminiLive';
import { usePvpRoom } from './hooks/usePvpRoom';
import { useGameHistory } from './hooks/useGameHistory';
import { AuthScreen } from './components/AuthScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { PlaySetupFlow } from './components/PlaySetupFlow';
import { AnalyzeMenu } from './components/AnalyzeMenu';
import { ImportPgnView } from './components/ImportPgnView';
import { FriendsView } from './components/FriendsView';
import { EvalBar } from './components/EvalBar';
import { BoardEditorControls } from './components/BoardEditorControls';
import { VoiceCoachBar } from './components/VoiceCoachBar';
import { ChessClockBar } from './components/ChessClockBar';
import { MoveHistoryNavigator } from './components/MoveHistoryNavigator';
import { HistoryPanel } from './components/HistoryPanel';
import { PuzzlesPanel } from './components/PuzzlesPanel';
import { KingStatusOverlay, getBoardKingStatus, mergeCheckSquareStyles } from './components/KingStatusOverlay';
import { AppearanceSheet } from './components/AppearanceSheet';
import { getBoardTheme, type UiThemeId, type BoardThemeId } from './constants/themes';
import { playChessSound } from './utils/chessAudio';
import { getMaterialSummary } from './utils/material';
import { DEFAULT_TIME_CONTROL } from './constants/timeControls';
import { CHESS_PUZZLES } from './constants/puzzles';
import { buildBoardSnapshot, getFenAtPly, uciPvToSan } from './utils/chessFormat';
import type {
  ActiveView,
  BoardArrow,
  BottomTab,
  ChessPuzzle,
  GameHistoryEntry,
  PuzzleDifficulty,
  TimeControl,
} from './types/chess';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const SOLVED_PUZZLES_KEY = 'obsidian_chess_solved_puzzles';

export default function App() {
  const auth = useAuth();
  const [minSplashDone, setMinSplashDone] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setMinSplashDone(true), 2400);
    return () => window.clearTimeout(t);
  }, []);

  const isLoading = auth.initializing || !minSplashDone;

  useEffect(() => {
    if (!isLoading) {
      const fadeTimer = window.setTimeout(() => setSplashVisible(false), 320);
      return () => window.clearTimeout(fadeTimer);
    }
  }, [isLoading]);

  if (splashVisible) {
    return <LoadingScreen fadingOut={!isLoading} />;
  }

  if (!auth.user) {
    return (
      <AuthScreen
        isConfigured={auth.isSupabaseConfigured}
        submitting={auth.submitting}
        error={auth.error}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onClearError={auth.clearError}
      />
    );
  }

  return (
    <ChessWorkspace
      userId={auth.user.id}
      username={auth.username}
      onSignOut={auth.signOut}
    />
  );
}

interface ChessWorkspaceProps {
  userId: string;
  username: string;
  onSignOut: () => Promise<void>;
}

function ChessWorkspace({ userId, username, onSignOut }: ChessWorkspaceProps) {
  // Navigation state: 5 bottom tabs + focused sub-screens
  const [activeTab, setActiveTab] = useState<BottomTab>('home');
  const [activeView, setActiveView] = useState<ActiveView>('tab');

  // Local board state (shared cleanly across game-bot, game-self, analyze-board, analyze-editor)
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(START_FEN);
  const [startFen, setStartFen] = useState<string>(START_FEN);
  const [history, setHistory] = useState<string[]>([]);
  const [viewPly, setViewPly] = useState<number>(0);
  const [arrows, setArrows] = useState<BoardArrow[]>([]);

  // Bot & Self Game Settings
  const [skillLevel, setSkillLevel] = useState<number>(8);
  const [timeControl, setTimeControl] = useState<TimeControl>(DEFAULT_TIME_CONTROL);
  const [localClocks, setLocalClocks] = useState<{ w: number; b: number }>({
    w: DEFAULT_TIME_CONTROL.baseMs,
    b: DEFAULT_TIME_CONTROL.baseMs,
  });
  const [localClockRunning, setLocalClockRunning] = useState(false);
  const [localResult, setLocalResult] = useState<string | null>(null);
  const [selfFlipped, setSelfFlipped] = useState(false);
  const lastTickRef = useRef<number>(Date.now());

  // PvP non-destructive move browsing & invite copy
  const [pvpViewPly, setPvpViewPly] = useState<number>(0);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Appearance & Audio preferences (persisted)
  const [uiTheme, setUiTheme] = useState<UiThemeId>(() => {
    try {
      const v = localStorage.getItem('obsidian_ui_theme');
      return v === 'crimson' ? 'crimson' : 'obsidian';
    } catch {
      return 'obsidian';
    }
  });
  const [boardThemeId, setBoardThemeId] = useState<BoardThemeId>(() => {
    try {
      const v = localStorage.getItem('obsidian_board_theme');
      if (v === 'crimson-walnut' || v === 'emerald-club' || v === 'slate-steel' || v === 'obsidian') {
        return v;
      }
      return 'obsidian';
    } catch {
      return 'obsidian';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('obsidian_sound_enabled') !== 'false';
    } catch {
      return true;
    }
  });
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [lastMoveSquares, setLastMoveSquares] = useState<{ from: Square; to: Square } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', uiTheme);
    try {
      localStorage.setItem('obsidian_ui_theme', uiTheme);
    } catch {
      // ignore
    }
  }, [uiTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('obsidian_board_theme', boardThemeId);
    } catch {
      // ignore
    }
  }, [boardThemeId]);

  useEffect(() => {
    try {
      localStorage.setItem('obsidian_sound_enabled', String(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const activeBoardTheme = useMemo(() => getBoardTheme(boardThemeId), [boardThemeId]);

  // Tap-to-select & legal move highlights
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

  // Board Editor state
  const [selectedPiece, setSelectedPiece] = useState<string | 'trash'>('wQ');
  const [editorTurn, setEditorTurn] = useState<'w' | 'b'>('w');
  const [editorError, setEditorError] = useState<string | null>(null);

  // Puzzles state
  const [puzzleFilter, setPuzzleFilter] = useState<'all' | PuzzleDifficulty>('all');
  const [currentPuzzle, setCurrentPuzzle] = useState<ChessPuzzle>(CHESS_PUZZLES[0]);
  const [puzzleFen, setPuzzleFen] = useState<string>(CHESS_PUZZLES[0].fen);
  const [puzzleStep, setPuzzleStep] = useState<number>(0);
  const [puzzleStatus, setPuzzleStatus] = useState<'playing' | 'wrong' | 'solved'>('playing');
  const [showPuzzleHint, setShowPuzzleHint] = useState<boolean>(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SOLVED_PUZZLES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const { isReady, analysis, analyzePosition, getBestMove, stop } = useStockfish();
  const pvp = usePvpRoom({ playerId: userId, playerName: username });
  const gameHistory = useGameHistory(userId);

  const gameRef = useRef(game);
  gameRef.current = game;
  const analysisRef = useRef(analysis);
  analysisRef.current = analysis;
  const lastSyncedKeyRef = useRef<string>('');
  const autoJoinTriedRef = useRef(false);
  const savedPvpRoomKeyRef = useRef<string>('');
  const prevPvpMovesLenRef = useRef<number>(0);

  const isPuzzlesActive = activeView === 'tab' && activeTab === 'puzzles';
  const isAnalysisActive = activeView === 'analyze-board';
  const isCoachAllowed = isAnalysisActive || isPuzzlesActive;

  const filteredPuzzles = useMemo(
    () =>
      puzzleFilter === 'all'
        ? CHESS_PUZZLES
        : CHESS_PUZZLES.filter((p) => p.difficulty === puzzleFilter),
    [puzzleFilter]
  );

  // Sync PvP view ply when new moves arrive
  useEffect(() => {
    const len = pvp.room?.moves?.length || 0;
    if (len !== prevPvpMovesLenRef.current) {
      if (pvpViewPly === prevPvpMovesLenRef.current || len === 0) {
        setPvpViewPly(len);
      }
      prevPvpMovesLenRef.current = len;
    }
  }, [pvp.room?.moves, pvpViewPly]);

  // Auto-save finished PvP games to History
  useEffect(() => {
    if (!pvp.room || pvp.room.status !== 'finished') return;
    if (pvp.myColor !== 'w' && pvp.myColor !== 'b') return;
    const moves = pvp.room.moves || [];
    if (moves.length === 0) return;

    const saveKey = `${pvp.room.id}|${moves.length}|${pvp.room.winner}`;
    if (savedPvpRoomKeyRef.current === saveKey) return;
    savedPvpRoomKeyRef.current = saveKey;

    const opponentName =
      pvp.myColor === 'w'
        ? pvp.room.black_player_name || 'Opponent'
        : pvp.room.white_player_name || 'Opponent';

    const result: 'win' | 'loss' | 'draw' =
      pvp.room.winner === 'draw'
        ? 'draw'
        : pvp.room.winner === pvp.myColor
        ? 'win'
        : 'loss';

    gameHistory.saveGame({
      mode: 'pvp',
      opponent_name: opponentName,
      player_color: pvp.myColor,
      result,
      end_reason: pvp.room.end_reason || 'finished',
      time_control_label: pvp.room.time_control_label,
      moves,
      final_fen: pvp.room.fen,
    });
  }, [pvp.room, pvp.myColor, gameHistory.saveGame]);

  // Auto-join ?room=CODE invite links straight into the PvP game screen
  useEffect(() => {
    if (autoJoinTriedRef.current) return;
    autoJoinTriedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('room');
    if (inviteCode) {
      pvp.joinRoom(inviteCode).then((joined) => {
        if (joined) setActiveView('game-pvp');
      });
    }
  }, [pvp.joinRoom]);

  const displayedLocalFen = useMemo(() => {
    if (activeView === 'analyze-editor') return fen;
    if (viewPly >= history.length) return fen;
    return getFenAtPly(history, viewPly, startFen);
  }, [activeView, fen, history, viewPly, startFen]);

  const displayedPvpFen = useMemo(() => {
    if (!pvp.room) return START_FEN;
    const moves = pvp.room.moves || [];
    if (pvpViewPly >= moves.length) return pvp.room.fen;
    return getFenAtPly(moves, pvpViewPly, START_FEN);
  }, [pvp.room, pvpViewPly]);

  const activeFen =
    activeView === 'game-pvp'
      ? displayedPvpFen
      : isPuzzlesActive
      ? puzzleFen
      : displayedLocalFen;

  const isViewingPastLocal =
    (activeView === 'game-bot' || activeView === 'game-self' || activeView === 'analyze-board') &&
    viewPly < history.length;

  const isViewingPastPvp =
    activeView === 'game-pvp' && Boolean(pvp.room) && pvpViewPly < (pvp.room?.moves?.length || 0);

  const puzzleSnapshotRef = useRef({ currentPuzzle, puzzleFen, puzzleStep, puzzleStatus });
  puzzleSnapshotRef.current = { currentPuzzle, puzzleFen, puzzleStep, puzzleStatus };

  const getBoardSnapshot = useCallback(() => {
    if (isPuzzlesActive) {
      const pState = puzzleSnapshotRef.current;
      const pGame = new Chess(pState.puzzleFen);
      return buildBoardSnapshot(pGame, analysisRef.current, {
        title: pState.currentPuzzle.title,
        theme: pState.currentPuzzle.theme,
        difficulty: pState.currentPuzzle.difficulty,
        hint: pState.currentPuzzle.hint,
        expectedNextMoveUci: pState.currentPuzzle.solution[pState.puzzleStep] || null,
        solved: pState.puzzleStatus === 'solved',
      });
    }
    const viewedGame = new Chess(activeFen);
    return buildBoardSnapshot(viewedGame, analysisRef.current);
  }, [isPuzzlesActive, activeFen]);

  const live = useGeminiLive({
    getBoardSnapshot,
    onDrawArrows: setArrows,
  });

  // Disconnect Voice Coach if leaving Analysis Board & Puzzles
  useEffect(() => {
    if (!isCoachAllowed && (live.isConnected || live.isConnecting)) {
      live.disconnect();
    }
  }, [isCoachAllowed, live.isConnected, live.isConnecting, live.disconnect]);

  // Auto-sync Analysis board & Stockfish PV to Gemini
  useEffect(() => {
    if (!isAnalysisActive || !live.isConnected) return;
    if (analysis.isThinking && analysis.depth < 12) return;

    const syncKey = `${displayedLocalFen}|${analysis.pv.slice(0, 4).join(',')}`;
    if (syncKey === lastSyncedKeyRef.current) return;
    lastSyncedKeyRef.current = syncKey;

    const viewedGame = new Chess(displayedLocalFen);
    const snapshot = buildBoardSnapshot(viewedGame, analysis);
    live.syncBoardState(snapshot);
  }, [isAnalysisActive, live.isConnected, live.syncBoardState, displayedLocalFen, analysis]);

  // Run Stockfish strictly in Analysis Board view
  useEffect(() => {
    if (isAnalysisActive) {
      analyzePosition(displayedLocalFen, 16);
    } else {
      stop();
    }
  }, [isAnalysisActive, displayedLocalFen, analyzePosition, stop]);

  // Local countdown ticker for Bot & Self timed games
  useEffect(() => {
    const isLocalTimed = activeView === 'game-bot' || activeView === 'game-self';
    if (!isLocalTimed || !localClockRunning || localResult || timeControl.baseMs === 0) return;

    lastTickRef.current = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      const activeTurn = gameRef.current.turn();

      setLocalClocks((prev) => {
        const nextVal = Math.max(0, prev[activeTurn] - delta);
        if (nextVal === 0) {
          setLocalClockRunning(false);
          stop();
          if (activeView === 'game-bot') {
            const userWon = activeTurn === 'b';
            setLocalResult(userWon ? 'You win on time!' : 'Stockfish wins on time');
            gameHistory.saveGame({
              mode: 'play',
              opponent_name: `Stockfish (Lvl ${skillLevel})`,
              player_color: 'w',
              result: userWon ? 'win' : 'loss',
              end_reason: 'timeout',
              time_control_label: timeControl.label,
              moves: gameRef.current.history(),
              final_fen: gameRef.current.fen(),
            });
          } else {
            setLocalResult(activeTurn === 'w' ? 'Black wins on time' : 'White wins on time');
          }
        }
        return { ...prev, [activeTurn]: nextVal };
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [activeView, localClockRunning, localResult, timeControl, skillLevel, stop, gameHistory.saveGame]);

  const clearSelection = useCallback(() => {
    setMoveFrom(null);
    setOptionSquares({});
  }, []);

  const syncGame = useCallback((nextGame: Chess) => {
    const nextFen = nextGame.fen();
    const nextHistory = nextGame.history();
    setGame(nextGame);
    setFen(nextFen);
    setHistory(nextHistory);
    setViewPly(nextHistory.length);
  }, []);

  const resetLocalBoard = useCallback(
    (tc: TimeControl = timeControl) => {
      stop();
      clearSelection();
      setArrows([]);
      setLastMoveSquares(null);
      setLocalClockRunning(false);
      setLocalResult(null);
      setLocalClocks({ w: tc.baseMs, b: tc.baseMs });
      setStartFen(START_FEN);
      const fresh = new Chess();
      syncGame(fresh);
    },
    [timeControl, stop, clearSelection, syncGame]
  );

  const drawPvArrows = useCallback((pv: string[]) => {
    const nextArrows: BoardArrow[] = [];
    if (pv[0] && pv[0].length >= 4) {
      nextArrows.push([
        pv[0].slice(0, 2) as Square,
        pv[0].slice(2, 4) as Square,
        'rgba(244, 244, 245, 0.85)',
      ]);
    }
    if (pv[1] && pv[1].length >= 4) {
      nextArrows.push([
        pv[1].slice(0, 2) as Square,
        pv[1].slice(2, 4) as Square,
        'rgba(161, 161, 170, 0.65)',
      ]);
    }
    setArrows(nextArrows);
  }, []);

  const loadPuzzle = useCallback(
    (puzzle: ChessPuzzle, announceToCoach = true) => {
      clearSelection();
      setArrows([]);
      setCurrentPuzzle(puzzle);
      setPuzzleFen(puzzle.fen);
      setPuzzleStep(0);
      setPuzzleStatus('playing');
      setShowPuzzleHint(false);

      if (announceToCoach && live.isConnected) {
        const pGame = new Chess(puzzle.fen);
        const snap = buildBoardSnapshot(pGame, analysisRef.current, {
          title: puzzle.title,
          theme: puzzle.theme,
          difficulty: puzzle.difficulty,
          hint: puzzle.hint,
          expectedNextMoveUci: puzzle.solution[0] || null,
          solved: false,
        });
        live.syncBoardState(
          snap,
          `New puzzle loaded: "${puzzle.title}". Do not spoil the move—just briefly invite me to solve it by asking something like "Can you find the right move here?"`
        );
      }
    },
    [clearSelection, live]
  );

  const boardOrientation: 'white' | 'black' =
    activeView === 'game-pvp' && pvp.myColor === 'b'
      ? 'black'
      : activeView === 'game-self' && selfFlipped
      ? 'black'
      : isPuzzlesActive && currentPuzzle.fen.split(' ')[1] === 'b'
      ? 'black'
      : 'white';

  const getMoveOptions = useCallback(
    (square: Square): boolean => {
      if (isViewingPastLocal || isViewingPastPvp) return false;
      if (isPuzzlesActive && puzzleStatus === 'solved') return false;

      const currentChess = new Chess(activeFen);
      if (activeView === 'game-pvp') {
        if (!pvp.room || pvp.room.status !== 'active') return false;
        if (pvp.myColor !== 'w' && pvp.myColor !== 'b') return false;
        if (currentChess.turn() !== pvp.myColor) return false;
      }

      const moves = currentChess.moves({ square, verbose: true });
      if (moves.length === 0) {
        clearSelection();
        return false;
      }

      const newSquares: Record<string, React.CSSProperties> = {};
      moves.forEach((move) => {
        const targetPiece = currentChess.get(move.to);
        const sourcePiece = currentChess.get(square);
        const isCapture = Boolean(
          targetPiece && sourcePiece && targetPiece.color !== sourcePiece.color
        );

        newSquares[move.to] = {
          background: isCapture
            ? 'radial-gradient(circle, transparent 60%, rgba(244, 244, 245, 0.55) 64%, rgba(244, 244, 245, 0.55) 78%, transparent 82%)'
            : 'radial-gradient(circle, rgba(244, 244, 245, 0.45) 22%, transparent 26%)',
          borderRadius: '50%',
        };
      });

      newSquares[square] = { background: 'rgba(244, 244, 245, 0.22)' };
      setOptionSquares(newSquares);
      return true;
    },
    [
      isViewingPastLocal,
      isViewingPastPvp,
      isPuzzlesActive,
      puzzleStatus,
      activeFen,
      activeView,
      pvp.room,
      pvp.myColor,
      clearSelection,
    ]
  );

  const handlePuzzleMove = useCallback(
    (from: Square, to: Square): boolean => {
      if (puzzleStatus === 'solved') return false;
      const expected = currentPuzzle.solution[puzzleStep];
      if (!expected) return false;

      const temp = new Chess(puzzleFen);
      let attempted;
      try {
        attempted = temp.move({ from, to, promotion: 'q' });
        if (!attempted) return false;
      } catch {
        return false;
      }

      const playedUci = `${from}${to}${attempted.promotion || ''}`;
      const isMatch = playedUci === expected || `${from}${to}` === expected;

      clearSelection();

      if (!isMatch) {
        setPuzzleStatus('wrong');
        if (live.isConnected) {
          const snap = buildBoardSnapshot(new Chess(puzzleFen), analysisRef.current, {
            title: currentPuzzle.title,
            theme: currentPuzzle.theme,
            difficulty: currentPuzzle.difficulty,
            hint: currentPuzzle.hint,
            expectedNextMoveUci: expected,
            solved: false,
          });
          live.syncBoardState(
            snap,
            `I just tried ${attempted.san}, which is not the right puzzle move. Gently tell me why to rethink and give a small nudge without spoiling the exact answer.`
          );
        }
        return false;
      }

      setArrows([]);
      setPuzzleFen(temp.fen());
      const nextStep = puzzleStep + 1;

      if (nextStep >= currentPuzzle.solution.length) {
        setPuzzleStep(nextStep);
        setPuzzleStatus('solved');
        setSolvedPuzzles((prev) => {
          if (prev.includes(currentPuzzle.id)) return prev;
          const next = [...prev, currentPuzzle.id];
          try {
            localStorage.setItem(SOLVED_PUZZLES_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });

        if (live.isConnected) {
          const snap = buildBoardSnapshot(temp, analysisRef.current, {
            title: currentPuzzle.title,
            theme: currentPuzzle.theme,
            difficulty: currentPuzzle.difficulty,
            hint: currentPuzzle.hint,
            expectedNextMoveUci: null,
            solved: true,
          });
          live.syncBoardState(
            snap,
            `I just played ${attempted.san} and solved "${currentPuzzle.title}"! Congratulate me briefly and explain in 1 sentence why that tactic worked.`
          );
        }
        return true;
      }

      setPuzzleStep(nextStep);
      setPuzzleStatus('playing');
      const oppUci = currentPuzzle.solution[nextStep];
      setTimeout(() => {
        const afterOpp = new Chess(temp.fen());
        try {
          afterOpp.move({
            from: oppUci.slice(0, 2),
            to: oppUci.slice(2, 4),
            promotion: oppUci[4] || 'q',
          });
          setPuzzleFen(afterOpp.fen());
          setPuzzleStep(nextStep + 1);
        } catch {
          // ignore
        }
      }, 450);

      return true;
    },
    [puzzleStatus, currentPuzzle, puzzleStep, puzzleFen, clearSelection, live]
  );

  const executeMove = useCallback(
    (sourceSquare: Square, targetSquare: Square): boolean => {
      if (isPuzzlesActive) return handlePuzzleMove(sourceSquare, targetSquare);

      if (activeView === 'game-pvp') {
        if (isViewingPastPvp) return false;
        clearSelection();
        pvp.makeMove(sourceSquare, targetSquare);
        return true;
      }

      if (isViewingPastLocal) return false;
      if ((activeView === 'game-bot' || activeView === 'game-self') && localResult) return false;

      const movingTurn = game.turn();
      const next = new Chess(game.fen());
      let playedMove;
      try {
        playedMove = next.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        if (!playedMove) return false;
      } catch {
        return false;
      }

      clearSelection();
      setArrows([]);
      setLastMoveSquares({ from: sourceSquare, to: targetSquare });
      syncGame(next);

      if (next.isCheckmate()) playChessSound('checkmate', soundEnabled);
      else if (next.inCheck()) playChessSound('check', soundEnabled);
      else if (playedMove.captured) playChessSound('capture', soundEnabled);
      else playChessSound('move', soundEnabled);

      if (activeView === 'game-self') {
        if (timeControl.baseMs > 0) {
          setLocalClockRunning(true);
          if (timeControl.incrementMs > 0) {
            setLocalClocks((prev) => ({
              ...prev,
              [movingTurn]: prev[movingTurn] + timeControl.incrementMs,
            }));
          }
        }
        if (next.isGameOver()) {
          setLocalClockRunning(false);
          setLocalResult(
            next.isCheckmate()
              ? `Checkmate — ${movingTurn === 'w' ? 'White' : 'Black'} wins!`
              : 'Game drawn'
          );
        }
        return true;
      }

      if (activeView === 'game-bot') {
        if (timeControl.baseMs > 0) {
          setLocalClockRunning(true);
          if (timeControl.incrementMs > 0) {
            setLocalClocks((prev) => ({ ...prev, w: prev.w + timeControl.incrementMs }));
          }
        }

        if (next.isGameOver()) {
          setLocalClockRunning(false);
          const isMate = next.isCheckmate();
          setLocalResult(isMate ? 'Checkmate — You win!' : 'Game drawn');
          gameHistory.saveGame({
            mode: 'play',
            opponent_name: `Stockfish (Lvl ${skillLevel})`,
            player_color: 'w',
            result: isMate ? 'win' : 'draw',
            end_reason: isMate ? 'checkmate' : 'draw',
            time_control_label: timeControl.label,
            moves: next.history(),
            final_fen: next.fen(),
          });
          return true;
        }

        getBestMove(next.fen(), skillLevel, 12).then((uci) => {
          if (!uci || uci.length < 4) return;
          const aiNext = new Chess(next.fen());
          try {
            const botMove = aiNext.move({
              from: uci.slice(0, 2),
              to: uci.slice(2, 4),
              promotion: uci[4] || 'q',
            });
            if (botMove) {
              setLastMoveSquares({ from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square });
              if (aiNext.isCheckmate()) playChessSound('checkmate', soundEnabled);
              else if (aiNext.inCheck()) playChessSound('check', soundEnabled);
              else if (botMove.captured) playChessSound('capture', soundEnabled);
              else playChessSound('move', soundEnabled);
            }
            syncGame(aiNext);

            if (timeControl.baseMs > 0 && timeControl.incrementMs > 0) {
              setLocalClocks((prev) => ({ ...prev, b: prev.b + timeControl.incrementMs }));
            }

            if (aiNext.isGameOver()) {
              setLocalClockRunning(false);
              const isMate = aiNext.isCheckmate();
              setLocalResult(isMate ? 'Checkmate — Stockfish wins' : 'Game drawn');
              gameHistory.saveGame({
                mode: 'play',
                opponent_name: `Stockfish (Lvl ${skillLevel})`,
                player_color: 'w',
                result: isMate ? 'loss' : 'draw',
                end_reason: isMate ? 'checkmate' : 'draw',
                time_control_label: timeControl.label,
                moves: aiNext.history(),
                final_fen: aiNext.fen(),
              });
            }
          } catch {
            // ignore
          }
        });
      }

      return true;
    },
    [
      isPuzzlesActive,
      handlePuzzleMove,
      activeView,
      isViewingPastPvp,
      isViewingPastLocal,
      pvp,
      localResult,
      game,
      timeControl,
      skillLevel,
      clearSelection,
      syncGame,
      getBestMove,
      gameHistory.saveGame,
    ]
  );

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (activeView === 'analyze-editor') {
      const next = new Chess(fen);
      const piece = next.remove(sourceSquare);
      if (piece) {
        next.put(piece, targetSquare);
        setStartFen(next.fen());
        syncGame(next);
      }
      return true;
    }
    return executeMove(sourceSquare, targetSquare);
  };

  const onSquareClick = (square: Square) => {
    if (activeView === 'analyze-editor') {
      setEditorError(null);
      const next = new Chess();
      try {
        next.load(fen);
      } catch {
        next.clear();
      }
      if (selectedPiece === 'trash') {
        next.remove(square);
      } else {
        const color = selectedPiece[0] as Color;
        const type = selectedPiece[1].toLowerCase() as PieceSymbol;
        next.put({ color, type }, square);
      }
      const parts = next.fen().split(' ');
      parts[1] = editorTurn;
      const updatedFen = parts.join(' ');
      setFen(updatedFen);
      setStartFen(updatedFen);
      setGame(next);
      return;
    }

    if (!moveFrom) {
      const hasOptions = getMoveOptions(square);
      if (hasOptions) setMoveFrom(square);
      return;
    }
    if (moveFrom === square) {
      clearSelection();
      return;
    }
    const moved = executeMove(moveFrom, square);
    if (!moved) {
      const hasOptions = getMoveOptions(square);
      setMoveFrom(hasOptions ? square : null);
    }
  };

  const openInAnalysis = useCallback(
    (moves: string[], fallbackFen: string) => {
      const replay = new Chess();
      try {
        if (moves.length > 0) {
          for (const san of moves) replay.move(san);
          setStartFen(START_FEN);
        } else {
          replay.load(fallbackFen);
          setStartFen(fallbackFen);
        }
      } catch {
        replay.load(fallbackFen);
        setStartFen(fallbackFen);
      }
      clearSelection();
      setArrows([]);
      syncGame(replay);
      setActiveTab('analyze');
      setActiveView('analyze-board');
    },
    [clearSelection, syncGame]
  );

  const handleCoachFromEditor = () => {
    setEditorError(null);
    const parts = fen.split(' ');
    parts[1] = editorTurn;
    const targetFen = parts.join(' ');

    try {
      const validated = new Chess(targetFen);
      clearSelection();
      setStartFen(validated.fen());
      syncGame(validated);
      setActiveView('analyze-board');
    } catch {
      setEditorError('Invalid position. Make sure both White and Black kings are on the board.');
    }
  };

  const handleStepPv = () => {
    if (viewPly < history.length) {
      setViewPly(viewPly + 1);
      return;
    }
    const best = analysis.pv[0];
    if (!best || best.length < 4) return;
    const next = new Chess(game.fen());
    try {
      next.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best[4] || 'q' });
      clearSelection();
      syncGame(next);
      setArrows([]);
    } catch {
      // ignore
    }
  };

  const handleSignOutClick = async () => {
    live.disconnect();
    pvp.leaveRoom();
    stop();
    await onSignOut();
  };

  const handleCopyPvpInvite = () => {
    if (!pvp.room) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${pvp.room.code}`;
    navigator.clipboard.writeText(url);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 1800);
  };

  const pvSan = uciPvToSan(displayedLocalFen, analysis.pv);
  const activeKingStatus = useMemo(() => getBoardKingStatus(activeFen), [activeFen]);
  const material = useMemo(() => getMaterialSummary(activeFen), [activeFen]);
  const mergedSquareStyles = useMemo(() => {
    const base: Record<string, React.CSSProperties> = {};
    if (lastMoveSquares && activeView !== 'analyze-editor') {
      base[lastMoveSquares.from] = { backgroundColor: activeBoardTheme.lastMoveFrom };
      base[lastMoveSquares.to] = { backgroundColor: activeBoardTheme.lastMoveTo };
    }
    return mergeCheckSquareStyles({ ...base, ...optionSquares }, activeKingStatus);
  }, [lastMoveSquares, activeView, activeBoardTheme, optionSquares, activeKingStatus]);
  const topColor: 'w' | 'b' = boardOrientation === 'white' ? 'b' : 'w';
  const bottomColor: 'w' | 'b' = boardOrientation === 'white' ? 'w' : 'b';

  // --- RENDER VIEWS ---

  // 1. Play Setup Wizard
  if (activeView === 'play-setup') {
    return (
      <PlaySetupFlow
        skillLevel={skillLevel}
        onChangeSkillLevel={setSkillLevel}
        timeControl={timeControl}
        onChangeTimeControl={setTimeControl}
        pvpLoading={pvp.loading}
        pvpError={pvp.error}
        onStartBot={() => {
          resetLocalBoard(timeControl);
          setActiveView('game-bot');
        }}
        onStartSelf={() => {
          resetLocalBoard(timeControl);
          setSelfFlipped(false);
          setActiveView('game-self');
        }}
        onCreatePvp={async (side, tc) => {
          const created = await pvp.createRoom(side, tc);
          if (created) setActiveView('game-pvp');
        }}
        onJoinPvp={async (code) => {
          const joined = await pvp.joinRoom(code);
          if (joined) setActiveView('game-pvp');
        }}
        onBack={() => setActiveView('tab')}
      />
    );
  }

  // 2. Import PGN Screen
  if (activeView === 'analyze-import') {
    return (
      <ImportPgnView
        onImportSuccess={(moves, finalFen) => openInAnalysis(moves, finalFen)}
        onBack={() => {
          setActiveTab('analyze');
          setActiveView('tab');
        }}
      />
    );
  }

  // 3. Clean Active Game Screen: Bot or Self (NO EvalBar, NO Voice Coach, NO setup sliders)
  if (activeView === 'game-bot' || activeView === 'game-self') {
    const isBot = activeView === 'game-bot';
    return (
      <div className="min-h-screen px-4 py-5 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              stop();
              setLocalClockRunning(false);
              setActiveView('tab');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle hover:bg-zinc-800 text-xs text-zinc-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>

          <span className="text-xs font-mono text-zinc-400">
            {isBot ? `Bot Lvl ${skillLevel}` : 'Pass & Play'} · {timeControl.label}
          </span>

          <button
            type="button"
            onClick={() => resetLocalBoard(timeControl)}
            className="p-2 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-300"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[480px] space-y-2.5">
              <ChessClockBar
                name={isBot ? `Stockfish (Lvl ${skillLevel})` : topColor === 'b' ? 'Black' : 'White'}
                color={topColor}
                timeMs={localClocks[topColor]}
                isUntimed={timeControl.baseMs === 0}
                isActive={localClockRunning && game.turn() === topColor && !localResult}
                capturedPieces={topColor === 'w' ? material.capturedByWhite : material.capturedByBlack}
                materialAdvantage={topColor === 'w' ? material.whiteAdvantage : material.blackAdvantage}
              />

              <div className="board-frame p-2.5 rounded-2xl">
                <div className="relative">
                  <Chessboard
                    position={displayedLocalFen}
                    boardOrientation={boardOrientation}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    customSquareStyles={mergedSquareStyles}
                    customDarkSquareStyle={{ backgroundColor: activeBoardTheme.darkSquare }}
                    customLightSquareStyle={{ backgroundColor: activeBoardTheme.lightSquare }}
                    customBoardStyle={{ borderRadius: '10px', overflow: 'hidden' }}
                  />
                  <KingStatusOverlay fen={displayedLocalFen} orientation={boardOrientation} />
                </div>
              </div>

              <ChessClockBar
                name={isBot ? `@${username}` : bottomColor === 'w' ? 'White' : 'Black'}
                color={bottomColor}
                timeMs={localClocks[bottomColor]}
                isUntimed={timeControl.baseMs === 0}
                isActive={localClockRunning && game.turn() === bottomColor && !localResult}
                capturedPieces={bottomColor === 'w' ? material.capturedByWhite : material.capturedByBlack}
                materialAdvantage={bottomColor === 'w' ? material.whiteAdvantage : material.blackAdvantage}
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-4 space-y-4">
              {localResult && (
                <div className="bg-zinc-900/95 border border-white/15 rounded-xl p-3.5 space-y-2.5">
                  <p className="text-sm font-semibold text-zinc-100 text-center">{localResult}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => resetLocalBoard(timeControl)}
                      className="py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold"
                    >
                      Play Again
                    </button>
                    <button
                      type="button"
                      onClick={() => openInAnalysis(history, fen)}
                      className="py-2 rounded-lg glass-subtle hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Analyze
                    </button>
                  </div>
                </div>
              )}

              <MoveHistoryNavigator
                moves={history}
                viewPly={viewPly}
                onChangePly={(ply) => {
                  clearSelection();
                  setViewPly(ply);
                }}
              />

              <div className="grid grid-cols-2 gap-2">
                {!isBot && (
                  <button
                    type="button"
                    onClick={() => setSelfFlipped((v) => !v)}
                    className="py-2 rounded-xl text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-200 flex items-center justify-center gap-1.5"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    Flip Board
                  </button>
                )}
                {isBot && !localResult && (
                  <button
                    type="button"
                    onClick={() => {
                      stop();
                      setLocalClockRunning(false);
                      setLocalResult('You resigned — Stockfish wins');
                      if (history.length > 0) {
                        gameHistory.saveGame({
                          mode: 'play',
                          opponent_name: `Stockfish (Lvl ${skillLevel})`,
                          player_color: 'w',
                          result: 'loss',
                          end_reason: 'resignation',
                          time_control_label: timeControl.label,
                          moves: history,
                          final_fen: fen,
                        });
                      }
                    }}
                    className="py-2 rounded-xl text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Resign
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openInAnalysis(history, fen)}
                  className="py-2 rounded-xl text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-200 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Clean Active PvP Room Screen (NO EvalBar, NO Voice Coach)
  if (activeView === 'game-pvp' && pvp.room) {
    const room = pvp.room;
    const incomingDraw =
      room.status === 'active' &&
      room.draw_offer_by &&
      pvp.myColor &&
      pvp.myColor !== 'spectator' &&
      room.draw_offer_by !== pvp.myColor;
    const outgoingDraw =
      room.status === 'active' && room.draw_offer_by && room.draw_offer_by === pvp.myColor;
    const resultLabel =
      room.status === 'finished'
        ? room.winner === 'draw'
          ? `Draw (${room.end_reason || 'draw'})`
          : `${room.winner === 'w' ? 'White' : 'Black'} wins by ${room.end_reason || 'checkmate'}`
        : null;

    return (
      <div className="min-h-screen px-4 py-5 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              pvp.leaveRoom();
              setActiveView('tab');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle hover:bg-zinc-800 text-xs text-zinc-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Leave
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-bold tracking-widest text-zinc-100">{room.code}</span>
            <span className="text-zinc-500">·</span>
            <span className="font-mono text-zinc-400">{room.time_control_label}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyPvpInvite}
            className="px-3 py-1.5 rounded-xl glass-subtle hover:bg-zinc-800 text-xs text-zinc-200 flex items-center gap-1.5"
          >
            {copiedInvite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedInvite ? 'Copied' : 'Invite'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[480px] space-y-2.5">
              <ChessClockBar
                name={
                  (topColor === 'w' ? room.white_player_name : room.black_player_name) ||
                  'Waiting for opponent...'
                }
                color={topColor}
                timeMs={pvp.displayClocks[topColor]}
                isUntimed={room.base_time_ms === 0}
                isActive={room.status === 'active' && room.turn === topColor}
                capturedPieces={topColor === 'w' ? material.capturedByWhite : material.capturedByBlack}
                materialAdvantage={topColor === 'w' ? material.whiteAdvantage : material.blackAdvantage}
              />

              <div className="board-frame p-2.5 rounded-2xl">
                <div className="relative">
                  <Chessboard
                    position={displayedPvpFen}
                    boardOrientation={boardOrientation}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    customSquareStyles={mergedSquareStyles}
                    customDarkSquareStyle={{ backgroundColor: activeBoardTheme.darkSquare }}
                    customLightSquareStyle={{ backgroundColor: activeBoardTheme.lightSquare }}
                    customBoardStyle={{ borderRadius: '10px', overflow: 'hidden' }}
                  />
                  <KingStatusOverlay fen={displayedPvpFen} orientation={boardOrientation} />
                </div>
              </div>

              <ChessClockBar
                name={
                  (bottomColor === 'w' ? room.white_player_name : room.black_player_name) ||
                  'Waiting...'
                }
                color={bottomColor}
                timeMs={pvp.displayClocks[bottomColor]}
                isUntimed={room.base_time_ms === 0}
                isActive={room.status === 'active' && room.turn === bottomColor}
                statusTag={pvp.myColor === bottomColor ? 'You' : undefined}
                capturedPieces={bottomColor === 'w' ? material.capturedByWhite : material.capturedByBlack}
                materialAdvantage={bottomColor === 'w' ? material.whiteAdvantage : material.blackAdvantage}
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  {room.status === 'waiting' ? (
                    'Share the Invite link to start'
                  ) : pvp.isOpponentOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-zinc-200" />
                      Opponent online
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-zinc-500" />
                      Opponent away
                    </>
                  )}
                </span>
              </div>

              {incomingDraw && (
                <div className="bg-zinc-900/90 border border-white/15 rounded-xl p-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-200">Opponent offered a draw</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => pvp.respondDraw(true)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-semibold"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => pvp.respondDraw(false)}
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
                      onClick={pvp.requestRematch}
                      className="py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Rematch
                    </button>
                    <button
                      onClick={() => openInAnalysis(room.moves || [], room.fen)}
                      className="py-2 rounded-lg glass-subtle hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Analyze
                    </button>
                  </div>
                </div>
              )}

              {room.status === 'active' && (pvp.myColor === 'w' || pvp.myColor === 'b') && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={Boolean(outgoingDraw)}
                    onClick={pvp.offerDraw}
                    className="py-2 rounded-xl text-xs font-medium glass-subtle hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 flex items-center justify-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    {outgoingDraw ? 'Draw Offered' : 'Offer Draw'}
                  </button>
                  <button
                    type="button"
                    onClick={pvp.resign}
                    className="py-2 rounded-xl text-xs font-medium glass-subtle hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-1.5"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Resign
                  </button>
                </div>
              )}

              <MoveHistoryNavigator
                moves={room.moves || []}
                viewPly={pvpViewPly}
                onChangePly={setPvpViewPly}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Analysis Board Screen (EvalBar + Stockfish PV + Move Navigator + Gemini Live Coach)
  if (activeView === 'analyze-board') {
    return (
      <div className="min-h-screen px-4 py-5 max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              live.disconnect();
              stop();
              setActiveTab('analyze');
              setActiveView('tab');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle hover:bg-zinc-800 text-xs text-zinc-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Analyze Menu
          </button>

          <span className="text-xs font-medium text-zinc-300">
            Stockfish {isReady ? `· Depth ${analysis.depth}` : '· Loading...'}
          </span>

          <button
            type="button"
            onClick={() => resetLocalBoard()}
            className="p-2 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-300"
            title="Reset Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex items-stretch justify-center gap-3">
            <EvalBar analysis={analysis} />
            <div className="w-full max-w-[480px] board-frame p-2.5 rounded-2xl">
              <div className="relative">
                <Chessboard
                  position={displayedLocalFen}
                  onPieceDrop={onDrop}
                  onSquareClick={onSquareClick}
                  customArrows={arrows}
                  customSquareStyles={mergedSquareStyles}
                  customDarkSquareStyle={{ backgroundColor: activeBoardTheme.darkSquare }}
                  customLightSquareStyle={{ backgroundColor: activeBoardTheme.lightSquare }}
                  customBoardStyle={{ borderRadius: '10px', overflow: 'hidden' }}
                />
                <KingStatusOverlay fen={displayedLocalFen} orientation="white" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Best Line (PV)</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => drawPvArrows(analysis.pv)}
                      className="px-2 py-1 rounded-md text-[11px] glass-subtle hover:bg-zinc-800 text-zinc-300"
                    >
                      Arrows
                    </button>
                    <button
                      onClick={handleStepPv}
                      disabled={!analysis.pv.length && viewPly >= history.length}
                      className="px-2 py-1 rounded-md text-[11px] bg-zinc-100 text-zinc-950 font-medium disabled:opacity-40 flex items-center gap-1"
                    >
                      <StepForward className="w-3 h-3" />
                      Step
                    </button>
                  </div>
                </div>
                <div className="font-mono text-xs text-zinc-300 bg-zinc-950/70 border border-white/5 rounded-xl p-2.5 min-h-[42px]">
                  {pvSan.length > 0
                    ? pvSan.join('  ')
                    : analysis.pv.length > 0
                    ? analysis.pv.slice(0, 8).join('  ')
                    : 'Computing best line...'}
                </div>
              </div>

              <button
                onClick={() => {
                  analyzePosition(displayedLocalFen, 16);
                  setTimeout(() => {
                    drawPvArrows(analysisRef.current.pv);
                    if (live.isConnected) {
                      const viewedGame = new Chess(displayedLocalFen);
                      const snapshot = buildBoardSnapshot(viewedGame, analysisRef.current);
                      live.syncBoardState(
                        snapshot,
                        'Explain the current position on the board and the best plan for the side to move, drawing arrows for the top moves.'
                      );
                    }
                  }, 700);
                }}
                className="w-full py-2.5 rounded-xl glass-subtle hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explain This Position Out Loud
              </button>

              <MoveHistoryNavigator
                moves={history}
                viewPly={viewPly}
                onChangePly={(ply) => {
                  clearSelection();
                  setArrows([]);
                  setViewPly(ply);
                }}
              />
            </div>

            <VoiceCoachBar
              modeLabel="Analysis Board"
              isConnected={live.isConnected}
              isConnecting={live.isConnecting}
              isMuted={live.isMuted}
              isSpeaking={live.isSpeaking}
              error={live.error}
              transcript={live.transcript}
              onConnect={live.connect}
              onDisconnect={live.disconnect}
              onToggleMute={live.toggleMute}
            />
          </div>
        </div>
      </div>
    );
  }

  // 6. Board Editor Screen (under Analyze)
  if (activeView === 'analyze-editor') {
    return (
      <div className="min-h-screen px-4 py-5 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setActiveTab('analyze');
              setActiveView('tab');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle hover:bg-zinc-800 text-xs text-zinc-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Analyze Menu
          </button>
          <span className="text-xs font-semibold text-zinc-200">Board Editor</span>
          <div className="w-14" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[480px] board-frame p-2.5 rounded-2xl">
              <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                onSquareClick={onSquareClick}
                customDarkSquareStyle={{ backgroundColor: activeBoardTheme.darkSquare }}
                customLightSquareStyle={{ backgroundColor: activeBoardTheme.lightSquare }}
                customBoardStyle={{ borderRadius: '10px', overflow: 'hidden' }}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-4">
              <BoardEditorControls
                selectedPiece={selectedPiece}
                onSelectPiece={setSelectedPiece}
                turn={editorTurn}
                onTurnChange={(t) => {
                  setEditorTurn(t);
                  const parts = fen.split(' ');
                  parts[1] = t;
                  setFen(parts.join(' '));
                  setStartFen(parts.join(' '));
                }}
                fen={fen}
                onLoadFen={(input) => {
                  try {
                    const loaded = new Chess(input.trim());
                    clearSelection();
                    setStartFen(loaded.fen());
                    syncGame(loaded);
                    setEditorError(null);
                  } catch {
                    setEditorError('Invalid FEN string.');
                  }
                }}
                onClearBoard={() => {
                  const empty = new Chess();
                  empty.clear();
                  clearSelection();
                  setGame(empty);
                  setFen('8/8/8/8/8/8/8/8 w - - 0 1');
                  setStartFen('8/8/8/8/8/8/8/8 w - - 0 1');
                }}
                onResetBoard={() => resetLocalBoard()}
                onCoachFromHere={handleCoachFromEditor}
                editorError={editorError}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. Main 5-Tab Shell (Home | Puzzles | Analyze | History | Friends)
  return (
    <div className="min-h-screen">
      {activeTab === 'home' && (
        <HomeView
          username={username}
          recentGames={gameHistory.games}
          solvedPuzzlesCount={solvedPuzzles.length}
          totalPuzzlesCount={CHESS_PUZZLES.length}
          nextPuzzle={CHESS_PUZZLES.find((p) => !solvedPuzzles.includes(p.id)) || CHESS_PUZZLES[0]}
          boardDarkSquare={activeBoardTheme.darkSquare}
          boardLightSquare={activeBoardTheme.lightSquare}
          onOpenPlaySetup={() => setActiveView('play-setup')}
          onOpenNextPuzzle={() => {
            const nextP = CHESS_PUZZLES.find((p) => !solvedPuzzles.includes(p.id)) || CHESS_PUZZLES[0];
            loadPuzzle(nextP, false);
            setActiveTab('puzzles');
          }}
          onOpenAnalyzeBoard={() => {
            resetLocalBoard();
            setActiveTab('analyze');
            setActiveView('analyze-board');
          }}
          onOpenHistory={() => setActiveTab('history')}
          onReviewGame={(g) => openInAnalysis(g.moves || [], g.final_fen)}
          onOpenAppearance={() => setAppearanceOpen(true)}
          onSignOut={handleSignOutClick}
        />
      )}

      {activeTab === 'puzzles' && (
        <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[480px] board-frame p-2.5 rounded-2xl">
                <div className="relative">
                  <Chessboard
                    position={puzzleFen}
                    boardOrientation={boardOrientation}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    customArrows={arrows}
                    customSquareStyles={mergedSquareStyles}
                    customDarkSquareStyle={{ backgroundColor: activeBoardTheme.darkSquare }}
                    customLightSquareStyle={{ backgroundColor: activeBoardTheme.lightSquare }}
                    customBoardStyle={{ borderRadius: '10px', overflow: 'hidden' }}
                  />
                  <KingStatusOverlay fen={puzzleFen} orientation={boardOrientation} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel rounded-2xl p-4">
                <PuzzlesPanel
                  puzzles={filteredPuzzles}
                  currentPuzzle={currentPuzzle}
                  difficultyFilter={puzzleFilter}
                  onChangeFilter={(f) => {
                    setPuzzleFilter(f);
                    const nextList =
                      f === 'all' ? CHESS_PUZZLES : CHESS_PUZZLES.filter((p) => p.difficulty === f);
                    if (nextList.length > 0 && !nextList.some((p) => p.id === currentPuzzle.id)) {
                      loadPuzzle(nextList[0], true);
                    }
                  }}
                  solvedIds={solvedPuzzles}
                  status={puzzleStatus}
                  stepIndex={puzzleStep}
                  showHintText={showPuzzleHint}
                  onSelectPuzzle={(p) => loadPuzzle(p, true)}
                  onRequestHint={() => {
                    setShowPuzzleHint(true);
                    const expected = currentPuzzle.solution[puzzleStep];
                    if (expected && expected.length >= 4) {
                      setArrows([
                        [
                          expected.slice(0, 2) as Square,
                          expected.slice(2, 4) as Square,
                          'rgba(244, 244, 245, 0.45)',
                        ],
                      ]);
                    }
                    if (live.isConnected) {
                      const snap = getBoardSnapshot();
                      live.syncBoardState(
                        snap,
                        `The student asked for a hint on "${currentPuzzle.title}". Give a subtle spoken hint about the tactical motif (${currentPuzzle.theme}) without revealing the exact destination square.`
                      );
                    }
                  }}
                  onRetry={() => loadPuzzle(currentPuzzle, false)}
                  onNextPuzzle={() => {
                    const idx = filteredPuzzles.findIndex((p) => p.id === currentPuzzle.id);
                    const next =
                      filteredPuzzles[(idx + 1) % filteredPuzzles.length] || CHESS_PUZZLES[0];
                    loadPuzzle(next, true);
                  }}
                  onAskCoach={() => {
                    if (live.isConnected) {
                      const snap = getBoardSnapshot();
                      live.syncBoardState(
                        snap,
                        `Guide me out loud on this puzzle "${currentPuzzle.title}" without spoiling the exact answer. Ask me a guiding question like "Can you find the right move here?"`
                      );
                    }
                  }}
                  isCoachConnected={live.isConnected}
                />
              </div>

              <VoiceCoachBar
                modeLabel="Puzzles Tutor"
                isConnected={live.isConnected}
                isConnecting={live.isConnecting}
                isMuted={live.isMuted}
                isSpeaking={live.isSpeaking}
                error={live.error}
                transcript={live.transcript}
                onConnect={live.connect}
                onDisconnect={live.disconnect}
                onToggleMute={live.toggleMute}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analyze' && (
        <AnalyzeMenu
          onOpenImportPgn={() => setActiveView('analyze-import')}
          onOpenEditor={() => {
            resetLocalBoard();
            setActiveView('analyze-editor');
          }}
          onOpenPlayAnalyzing={() => {
            resetLocalBoard();
            setActiveView('analyze-board');
          }}
        />
      )}

      {activeTab === 'history' && (
        <HistoryPanel
          games={gameHistory.games}
          loading={gameHistory.loading}
          error={gameHistory.error}
          onRefresh={gameHistory.loadHistory}
          onReviewGame={(g) => openInAnalysis(g.moves || [], g.final_fen)}
          onDeleteGame={gameHistory.deleteGame}
        />
      )}

      {activeTab === 'friends' && (
        <FriendsView
          username={username}
          onQuickPvp={() => setActiveView('play-setup')}
        />
      )}

      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          clearSelection();
          setArrows([]);
          setActiveTab(tab);
          setActiveView('tab');
        }}
      />

      <AppearanceSheet
        open={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
        uiTheme={uiTheme}
        onSelectUiTheme={setUiTheme}
        boardTheme={boardThemeId}
        onSelectBoardTheme={setBoardThemeId}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
      />
    </div>
  );
}
