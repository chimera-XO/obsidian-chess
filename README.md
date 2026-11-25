# Obsidian Chess — v7 (Mobile App Navigation Restructure)

## What's New in v7
- **5-Tab Bottom Navigation Bar (`Home | Puzzles | Analyze | History | Friends`):**
  - **Home:** Clean mobile dashboard with stats, quick links, recent games preview, and a prominent monochrome **Play** button anchored right above the bottom nav.
  - **Play Flow (`PlaySetupFlow.tsx`):** Step-by-step setup wizard — choose **Play Bot** (set level + time control), **Play PvP** (pick side + time control -> generate room link, or join by code), or **Play vs Self** (pick time control -> pass & play). Launching a game opens a clean, distraction-free board with **no Eval Bar and no setup clutter**.
  - **Analyze Menu (`AnalyzeMenu.tsx`):** Choose between **Import PGN** (with 1-tap Opera Game sample), **Board Editor**, or **Play While Analyzing** (the only place where Stockfish's Eval Bar appears).
  - **Puzzles:** 15 verified puzzles with the Gemini Live Voice Tutor.
  - **History:** Saved Bot & PvP games with 1-tap **Review in Analysis**.
  - **Friends:** Clean placeholder ready for friend requests and direct challenges next.
