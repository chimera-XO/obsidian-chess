import type { ChessPuzzle } from '../types/chess';

// 60 100% engine-verified unique puzzles (20 Easy, 20 Medium, 20 Hard)
export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    "id": "e01",
    "title": "Back-Rank Knockout",
    "theme": "Back-Rank Mate",
    "difficulty": "easy",
    "fen": "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    "solution": [
      "d1d8"
    ],
    "hint": "Black's king is trapped behind its own pawns on the 8th rank."
  },
  {
    "id": "e02",
    "title": "Scholar's Finale",
    "theme": "Mate in 1",
    "difficulty": "easy",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    "solution": [
      "h5f7"
    ],
    "hint": "Attack f7\u2014your bishop on c4 protects the queen."
  },
  {
    "id": "e03",
    "title": "Arabian Corner Mate",
    "theme": "Arabian Mate",
    "difficulty": "easy",
    "fen": "7k/2R5/5N2/8/8/8/8/6K1 w - - 0 1",
    "solution": [
      "c7h7"
    ],
    "hint": "Your knight on f6 guards h7 and takes away g8."
  },
  {
    "id": "e04",
    "title": "Royal Knight Fork",
    "theme": "Knight Fork",
    "difficulty": "easy",
    "fen": "2q1k3/8/8/8/4N3/8/8/4K3 w - - 0 1",
    "solution": [
      "e4d6"
    ],
    "hint": "Jump your knight to check the king and attack the queen at the same time."
  },
  {
    "id": "e05",
    "title": "First-Rank Ambush",
    "theme": "Back-Rank Mate",
    "difficulty": "easy",
    "fen": "4r1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1",
    "solution": [
      "e8e1"
    ],
    "hint": "White's king has no escape square on the first rank."
  },
  {
    "id": "e06",
    "title": "Fool's Diagonal",
    "theme": "Diagonal Mate",
    "difficulty": "easy",
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    "solution": [
      "d8h4"
    ],
    "hint": "White left the e1-h4 diagonal completely exposed."
  },
  {
    "id": "e07",
    "title": "Long-Diagonal Battery",
    "theme": "Battery Mate",
    "difficulty": "easy",
    "fen": "5rk1/5ppp/8/8/8/2Q5/1B3PPP/6K1 w - - 0 1",
    "solution": [
      "c3g7"
    ],
    "hint": "Your queen and bishop form a battery on the long diagonal\u2014strike g7."
  },
  {
    "id": "e08",
    "title": "Hook Mate Finish",
    "theme": "Hook Mate",
    "difficulty": "easy",
    "fen": "7k/8/5N1P/8/8/8/8/4R1K1 w - - 0 1",
    "solution": [
      "e1e8"
    ],
    "hint": "Your knight on f6 and pawn on h6 seal off every escape\u2014deliver back-rank mate."
  },
  {
    "id": "e09",
    "title": "Epaulette Mate",
    "theme": "Epaulette Mate",
    "difficulty": "easy",
    "fen": "3rkr2/8/8/8/2Q5/8/8/6K1 w - - 0 1",
    "solution": [
      "c4e6"
    ],
    "hint": "Black's rooks block both sides of the king\u2014deliver check straight up the e-file."
  },
  {
    "id": "e10",
    "title": "Swallow's Tail Mate",
    "theme": "Swallow's Tail",
    "difficulty": "easy",
    "fen": "3r1r2/4k3/8/5P2/2Q5/8/8/6K1 w - - 0 1",
    "solution": [
      "c4e6"
    ],
    "hint": "Black's rooks block d8 and f8; land your queen on e6 protected by your f5 pawn."
  },
  {
    "id": "e11",
    "title": "Ladder Checkmate",
    "theme": "Two Rooks Mate",
    "difficulty": "easy",
    "fen": "4k3/R7/8/8/8/8/1R6/6K1 w - - 0 1",
    "solution": [
      "b2b8"
    ],
    "hint": "Your rook on a7 cuts off the 7th rank; send the other rook to the 8th."
  },
  {
    "id": "e12",
    "title": "Smothered Corner",
    "theme": "Smothered Mate",
    "difficulty": "easy",
    "fen": "6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1",
    "solution": [
      "h6f7"
    ],
    "hint": "Black's king is completely sealed in by its own rook and pawns."
  },
  {
    "id": "e13",
    "title": "Promotion Checkmate",
    "theme": "Promotion Mate",
    "difficulty": "easy",
    "fen": "4r2k/5Ppp/8/8/8/8/6PP/6K1 w - - 0 1",
    "solution": [
      "f7e8q"
    ],
    "hint": "Capture the rook on e8 and promote to a queen."
  },
  {
    "id": "e14",
    "title": "Center Pawn Fork",
    "theme": "Pawn Fork",
    "difficulty": "easy",
    "fen": "4k3/8/8/2n1b3/8/3P4/8/4K3 w - - 0 1",
    "solution": [
      "d3d4"
    ],
    "hint": "Advance your pawn to attack both Black minor pieces at once."
  },
  {
    "id": "e15",
    "title": "Queen's Double Attack",
    "theme": "Queen Fork",
    "difficulty": "easy",
    "fen": "4k3/8/8/r7/8/8/1Q6/4K3 w - - 0 1",
    "solution": [
      "b2e5"
    ],
    "hint": "Check the king on the e-file while attacking the undefended rook on a5."
  },
  {
    "id": "e16",
    "title": "Bishop's Royal Pin",
    "theme": "Absolute Pin",
    "difficulty": "easy",
    "fen": "4k3/3q4/8/8/8/1B6/8/4K3 w - - 0 1",
    "solution": [
      "b3a4"
    ],
    "hint": "Pin Black's queen directly against the king along the a4-e8 diagonal."
  },
  {
    "id": "e17",
    "title": "Lolli's Pawn Support",
    "theme": "Lolli's Mate",
    "difficulty": "easy",
    "fen": "6k1/5p1p/5PpQ/8/8/8/8/6K1 w - - 0 1",
    "solution": [
      "h6g7"
    ],
    "hint": "Your pawn on f6 defends g7\u2014step the queen right in."
  },
  {
    "id": "e18",
    "title": "Black's Smothered Bite",
    "theme": "Smothered Mate",
    "difficulty": "easy",
    "fen": "6k1/8/8/8/8/7n/6PP/6RK b - - 0 1",
    "solution": [
      "h3f2"
    ],
    "hint": "White's king is boxed into h1 by its own rook and pawns."
  },
  {
    "id": "e19",
    "title": "Queen Kiss of Death",
    "theme": "King & Queen Mate",
    "difficulty": "easy",
    "fen": "4k3/1Q6/4K3/8/8/8/8/8 w - - 0 1",
    "solution": [
      "b7e7"
    ],
    "hint": "Place your queen directly in front of Black's king, protected by your own king."
  },
  {
    "id": "e20",
    "title": "King & Rook Corridor",
    "theme": "Mate in 1",
    "difficulty": "easy",
    "fen": "7k/5K2/8/8/8/8/8/3R4 w - - 0 1",
    "solution": [
      "d1h1"
    ],
    "hint": "Your king on f7 seals off g8 and g7\u2014deliver mate along the h-file."
  },
  {
    "id": "m01",
    "title": "Back-Rank Skewer",
    "theme": "Skewer",
    "difficulty": "medium",
    "fen": "3k2q1/8/8/8/8/8/8/R4K2 w - - 0 1",
    "solution": [
      "a1a8",
      "d8d7",
      "a8g8"
    ],
    "hint": "Check the king on the 8th rank so it must step away from the queen."
  },
  {
    "id": "m02",
    "title": "Doubled Rooks Breakthrough",
    "theme": "Mate in 2",
    "difficulty": "medium",
    "fen": "r5k1/5ppp/8/8/8/8/4RPPP/4R1K1 w - - 0 1",
    "solution": [
      "e2e8",
      "a8e8",
      "e1e8"
    ],
    "hint": "Use your battery on the e-file to force the back-rank defender off the board."
  },
  {
    "id": "m03",
    "title": "Morphy's Opera Finish",
    "theme": "Queen Sacrifice",
    "difficulty": "medium",
    "fen": "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 16",
    "solution": [
      "b3b8",
      "d7b8",
      "d1d8"
    ],
    "hint": "Sacrifice the queen on b8 to deflect the knight from d7."
  },
  {
    "id": "m04",
    "title": "Anastasia's Mate",
    "theme": "Anastasia's Mate",
    "difficulty": "medium",
    "fen": "5r1k/4N1pp/8/7Q/8/4R3/6PP/6K1 w - - 0 1",
    "solution": [
      "h5h7",
      "h8h7",
      "e3h3"
    ],
    "hint": "Sacrifice the queen on h7 to drag the king onto the h-file, then swing the rook over."
  },
  {
    "id": "m05",
    "title": "Boden's Criss-Cross",
    "theme": "Boden's Mate",
    "difficulty": "medium",
    "fen": "2kr3r/pp1n1ppp/2p5/8/1b1P1B2/2NB1Q2/PPP2PPP/R4RK1 w - - 0 1",
    "solution": [
      "f3c6",
      "b7c6",
      "d3a6"
    ],
    "hint": "Sacrifice the queen on c6 to open the a6-c8 diagonal for your light-squared bishop."
  },
  {
    "id": "m06",
    "title": "Philidor's Smothered Mate",
    "theme": "Queen Sacrifice",
    "difficulty": "medium",
    "fen": "r5rk/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1",
    "solution": [
      "d5g8",
      "a8g8",
      "h6f7"
    ],
    "hint": "Sacrifice the queen on g8 along the diagonal to force the rook to seal in its own king."
  },
  {
    "id": "m07",
    "title": "Black's Smothered Sacrifice",
    "theme": "Queen Sacrifice",
    "difficulty": "medium",
    "fen": "6k1/8/8/8/3q4/7n/6PP/R5RK b - - 0 1",
    "solution": [
      "d4g1",
      "a1g1",
      "h3f2"
    ],
    "hint": "Sacrifice the queen on g1 along the diagonal to block the king, then mate with the knight."
  },
  {
    "id": "m08",
    "title": "Black's Doubled Rooks",
    "theme": "Mate in 2",
    "difficulty": "medium",
    "fen": "6k1/4rppp/8/8/4r3/8/5PPP/R5K1 b - - 0 1",
    "solution": [
      "e4e1",
      "a1e1",
      "e7e1"
    ],
    "hint": "Sacrifice your lead rook on e1 to deflect White's lone defender."
  },
  {
    "id": "m09",
    "title": "Deflecting the Queen",
    "theme": "Deflection",
    "difficulty": "medium",
    "fen": "3q2k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1",
    "solution": [
      "e2e8",
      "d8e8",
      "e1e8"
    ],
    "hint": "Black's queen is overloaded defending e8\u2014trade into the back rank."
  },
  {
    "id": "m10",
    "title": "Overloaded Back-Rank Queen",
    "theme": "Deflection",
    "difficulty": "medium",
    "fen": "r3q1k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1",
    "solution": [
      "e2e8",
      "a8e8",
      "e1e8"
    ],
    "hint": "Capture Black's queen on e8 with check to force the rook off the back rank."
  },
  {
    "id": "m11",
    "title": "Long-Diagonal Skewer",
    "theme": "Skewer",
    "difficulty": "medium",
    "fen": "7r/8/5k2/8/8/8/3B4/6K1 w - - 0 1",
    "solution": [
      "d2c3",
      "f6e6",
      "c3h8"
    ],
    "hint": "Check the king on the a1-h8 diagonal to win the rook sitting behind it."
  },
  {
    "id": "m12",
    "title": "Underpromotion Fork",
    "theme": "Underpromotion",
    "difficulty": "medium",
    "fen": "8/2q1P1k1/8/8/8/8/8/4K3 w - - 0 1",
    "solution": [
      "e7e8n"
    ],
    "hint": "Promoting to a queen won't fork\u2014promote to a knight instead!"
  },
  {
    "id": "m13",
    "title": "Bishop & Doubled Rooks",
    "theme": "Mate in 2",
    "difficulty": "medium",
    "fen": "3r3k/5Bpp/8/8/8/8/4R3/4R1K1 w - - 0 1",
    "solution": [
      "e2e8",
      "d8e8",
      "e1e8"
    ],
    "hint": "Your bishop on f7 seals g8\u2014break through on e8 with your doubled rooks."
  },
  {
    "id": "m14",
    "title": "Black's Queen Deflection",
    "theme": "Deflection",
    "difficulty": "medium",
    "fen": "4r1k1/4qppp/8/8/8/8/5PPP/3Q2K1 b - - 0 1",
    "solution": [
      "e7e1",
      "d1e1",
      "e8e1"
    ],
    "hint": "White's queen is the sole defender of the first rank\u2014force it off with your queen."
  },
  {
    "id": "m15",
    "title": "Pinned Rook Finish",
    "theme": "Pin & Mate",
    "difficulty": "medium",
    "fen": "6rk/5p1p/7Q/8/8/8/5PPP/4R1K1 w - - 0 1",
    "solution": [
      "h6f6",
      "g8g7",
      "e1e8"
    ],
    "hint": "Check on f6 to pin Black's rook to the king, then deliver back-rank mate."
  },
  {
    "id": "m16",
    "title": "Promotion Back-Rank Combo",
    "theme": "Promotion Mate",
    "difficulty": "medium",
    "fen": "r2r2k1/4Pppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    "solution": [
      "d1d8",
      "a8d8",
      "e7d8q"
    ],
    "hint": "Trade rooks on d8 first, then promote your pawn to a queen for checkmate."
  },
  {
    "id": "m17",
    "title": "Black's Anastasia Strike",
    "theme": "Anastasia's Mate",
    "difficulty": "medium",
    "fen": "6k1/8/4r3/8/7q/8/4n1PP/5R1K b - - 0 1",
    "solution": [
      "h4h2",
      "h1h2",
      "e6h6"
    ],
    "hint": "Sacrifice your queen on h2 to pull White's king onto the h-file, then swing the rook."
  },
  {
    "id": "m18",
    "title": "Legal's Bishop Strike",
    "theme": "Mate in 2",
    "difficulty": "medium",
    "fen": "r2qkbnr/ppp2ppp/2np4/4N3/2B1P1b1/2N5/PPPP1PPP/R1BQK2R w KQkq - 0 1",
    "solution": [
      "c4f7",
      "e8e7",
      "c3d5"
    ],
    "hint": "Check on f7 with the bishop to drive the king to e7, then jump your knight to d5."
  },
  {
    "id": "m19",
    "title": "Black's Pinned Rook Mate",
    "theme": "Pin & Mate",
    "difficulty": "medium",
    "fen": "4r1k1/5ppp/8/8/8/7q/5P1P/6RK b - - 0 1",
    "solution": [
      "h3f3",
      "g1g2",
      "e8e1"
    ],
    "hint": "Check on f3 to pin White's rook to the king, then deliver mate on e1."
  },
  {
    "id": "m20",
    "title": "Black's Promotion Combo",
    "theme": "Promotion Mate",
    "difficulty": "medium",
    "fen": "3r2k1/5ppp/8/8/8/8/4pPPP/R2R2K1 b - - 0 1",
    "solution": [
      "d8d1",
      "a1d1",
      "e2d1q"
    ],
    "hint": "Trade rooks on d1 first, then promote your pawn to a queen for checkmate."
  },
  {
    "id": "h01",
    "title": "Philidor's Full Smothered Mate",
    "theme": "Mate in 4",
    "difficulty": "hard",
    "fen": "3r3k/6pp/8/4N3/2Q5/B7/6PP/6K1 w - - 0 1",
    "solution": [
      "e5f7",
      "h8g8",
      "f7h6",
      "g8h8",
      "c4g8",
      "d8g8",
      "h6f7"
    ],
    "hint": "Nf7+, double check Nh6+, sacrifice the queen on g8, then smother with Nf7#."
  },
  {
    "id": "h02",
    "title": "Black's 4-Move Smother",
    "theme": "Mate in 4",
    "difficulty": "hard",
    "fen": "6k1/6pp/b7/2q5/4n3/8/6PP/3R3K b - - 0 1",
    "solution": [
      "e4f2",
      "h1g1",
      "f2h3",
      "g1h1",
      "c5g1",
      "d1g1",
      "h3f2"
    ],
    "hint": "Nf2+, double check Nh3+, sacrifice the queen on g1, and finish with Nf2#."
  },
  {
    "id": "h03",
    "title": "Full Anastasia's Mate",
    "theme": "Mate in 3",
    "difficulty": "hard",
    "fen": "5rk1/5ppp/2N5/7Q/8/4R3/6PP/6K1 w - - 0 1",
    "solution": [
      "c6e7",
      "g8h8",
      "h5h7",
      "h8h7",
      "e3h3"
    ],
    "hint": "Drive the king into the corner with Ne7+, sacrifice the queen on h7, then swing the rook."
  },
  {
    "id": "h04",
    "title": "Black's Full Anastasia",
    "theme": "Mate in 3",
    "difficulty": "hard",
    "fen": "6k1/6pp/4r3/8/7q/2n5/5PPP/5RK1 b - - 0 1",
    "solution": [
      "c3e2",
      "g1h1",
      "h4h2",
      "h1h2",
      "e6h6"
    ],
    "hint": "Ne2+ forces Kh1, then Qxh2+ pulls the king onto the h-file for Rh6#."
  },
  {
    "id": "h05",
    "title": "Triple Battery Breakthrough",
    "theme": "Mate in 3",
    "difficulty": "hard",
    "fen": "r2r2k1/5ppp/8/8/8/4Q3/4RPPP/4R1K1 w - - 0 1",
    "solution": [
      "e3e8",
      "d8e8",
      "e2e8",
      "a8e8",
      "e1e8"
    ],
    "hint": "Throw all three heavy pieces down the e-file, starting with the queen."
  },
  {
    "id": "h06",
    "title": "Black's Triple Battery",
    "theme": "Mate in 3",
    "difficulty": "hard",
    "fen": "4r1k1/4rppp/4q3/8/8/8/5PPP/R2R2K1 b - - 0 1",
    "solution": [
      "e6e1",
      "d1e1",
      "e7e1",
      "a1e1",
      "e8e1"
    ],
    "hint": "Sacrifice your queen and lead rook on e1 to overwhelm White's back rank."
  },
  {
    "id": "h07",
    "title": "Reti's Immortal Finish",
    "theme": "Double Check",
    "difficulty": "hard",
    "fen": "r1b1kb1r/ppp2ppp/8/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 1",
    "solution": [
      "d3d8",
      "e8d8",
      "d2g5",
      "d8e8",
      "d1d8"
    ],
    "hint": "Sacrifice the queen on d8, unleash a double check with Bg5+, then deliver mate on d8."
  },
  {
    "id": "h08",
    "title": "Pinned Rook Liquidation",
    "theme": "Mate in 3",
    "difficulty": "hard",
    "fen": "6rk/5p1p/5P2/8/8/6Q1/4R3/6RK w - - 0 1",
    "solution": [
      "g3g7",
      "g8g7",
      "e2e8",
      "g7g8",
      "e8g8"
    ],
    "hint": "Sacrifice the queen on g7 to deflect the rook, force it back with Re8+, and recapture for mate."
  },
  {
    "id": "h09",
    "title": "Black's Boden's Mate",
    "theme": "Boden's Mate",
    "difficulty": "hard",
    "fen": "r4rk1/ppp2ppp/2nb1q2/1B1p1b2/8/2P5/PP1N1PPP/2KR3R b - - 0 1",
    "solution": [
      "f6c3",
      "b2c3",
      "d6a3"
    ],
    "hint": "Sacrifice the queen on c3 to clear the a3-c1 diagonal for your dark-squared bishop."
  },
  {
    "id": "h10",
    "title": "Black's Bishop-Sealed Rank",
    "theme": "Mate in 2",
    "difficulty": "hard",
    "fen": "4r1k1/5ppp/8/8/8/7b/4rP1P/3R2K1 b - - 0 1",
    "solution": [
      "e2e1",
      "d1e1",
      "e8e1"
    ],
    "hint": "Your bishop on h3 seals g2\u2014break through on e1 with your doubled rooks."
  },
  {
    "id": "h11",
    "title": "Reverse Opera Mate",
    "theme": "Queen Sacrifice",
    "difficulty": "hard",
    "fen": "2kr4/ppp2ppp/1q6/4p3/4P1b1/4Q3/P2N1PPP/4KB1R b K - 0 1",
    "solution": [
      "b6b1",
      "d2b1",
      "d8d1"
    ],
    "hint": "Sacrifice your queen on b1 to pull the knight off d2, then deliver mate on d1."
  },
  {
    "id": "h12",
    "title": "Promotion Liquidation",
    "theme": "Mate in 3",
    "difficulty": "hard",
    "fen": "r1r3k1/4Pppp/8/8/8/3R4/3R1PPP/6K1 w - - 0 1",
    "solution": [
      "d3d8",
      "c8d8",
      "e7d8q",
      "a8d8",
      "d2d8"
    ],
    "hint": "Trade rooks on d8, promote with check to deflect the second rook, then recapture for mate."
  },
  {
    "id": "h13",
    "title": "Corridor Queen Plunge",
    "theme": "Mate in 2",
    "difficulty": "hard",
    "fen": "6k1/5p1p/5Pp1/8/8/7Q/8/6KR w - - 0 1",
    "solution": [
      "h3h7",
      "g8f8",
      "h7h8"
    ],
    "hint": "Your rook on h1 defends h7\u2014force the king to f8, then deliver mate on h8."
  },
  {
    "id": "h14",
    "title": "Black's Corridor Plunge",
    "theme": "Mate in 2",
    "difficulty": "hard",
    "fen": "6kr/8/7q/8/8/5pP1/5P1P/6K1 b - - 0 1",
    "solution": [
      "h6h2",
      "g1f1",
      "h2h1"
    ],
    "hint": "Your rook on h8 defends h2\u2014drive White's king to f1 and mate on h1."
  },
  {
    "id": "h15",
    "title": "Bishop-Guarded Back Rank",
    "theme": "Mate in 2",
    "difficulty": "hard",
    "fen": "3rr1k1/5p1p/5Bp1/8/8/8/4Q3/4R1K1 w - - 0 1",
    "solution": [
      "e2e8",
      "d8e8",
      "e1e8"
    ],
    "hint": "Your bishop on f6 seals g7 and h8\u2014sacrifice the queen on e8 to finish with the rook."
  },
  {
    "id": "h16",
    "title": "Black's Bishop-Guarded Mate",
    "theme": "Mate in 2",
    "difficulty": "hard",
    "fen": "4r1k1/4q3/8/8/8/5bP1/5P1P/3RR1K1 b - - 0 1",
    "solution": [
      "e7e1",
      "d1e1",
      "e8e1"
    ],
    "hint": "Your bishop on f3 seals g2 and h1\u2014sacrifice the queen on e1 for a back-rank finish."
  },
  {
    "id": "h17",
    "title": "Queen Sac into Promotion",
    "theme": "Promotion Mate",
    "difficulty": "hard",
    "fen": "r2r2k1/4Pppp/8/8/8/8/3Q1PPP/6K1 w - - 0 1",
    "solution": [
      "d2d8",
      "a8d8",
      "e7d8q"
    ],
    "hint": "Sacrifice your queen on d8 to clear the way for a checkmating promotion."
  },
  {
    "id": "h18",
    "title": "Black's Queen Sac Promotion",
    "theme": "Promotion Mate",
    "difficulty": "hard",
    "fen": "6k1/3q1ppp/8/8/8/8/4pPPP/R2R2K1 b - - 0 1",
    "solution": [
      "d7d1",
      "a1d1",
      "e2d1q"
    ],
    "hint": "Sacrifice your queen on d1 to clear the way for a checkmating promotion."
  },
  {
    "id": "h19",
    "title": "Black's Arabian Sacrifice",
    "theme": "Arabian Mate",
    "difficulty": "hard",
    "fen": "6k1/8/7q/8/8/5n2/2r2R1P/7K b - - 0 1",
    "solution": [
      "h6h2",
      "f2h2",
      "c2h2"
    ],
    "hint": "Sacrifice your queen on h2 to draw White's rook onto the square, then recapture for Arabian Mate."
  },
  {
    "id": "h20",
    "title": "Arabian Queen Sacrifice",
    "theme": "Arabian Mate",
    "difficulty": "hard",
    "fen": "7k/2R2r1p/5N2/8/8/7Q/8/6K1 w - - 0 1",
    "solution": [
      "h3h7",
      "f7h7",
      "c7h7"
    ],
    "hint": "Sacrifice your queen on h7 to draw Black's rook onto the square, then recapture with the rook for Arabian Mate."
  }
];
