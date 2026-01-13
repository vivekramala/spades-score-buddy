export interface Player {
  id: string;
  name: string;
  position: 0 | 1 | 2 | 3; // Seating position (clockwise order)
  totalScore: number;
}

export interface PlayerRoundData {
  playerId: string;
  bid: number;
  tricks: number;
  score: number;
}

export interface Round {
  id: string;
  roundNumber: number; // 1-13
  cardsPerPlayer: number; // Same as roundNumber
  dealerPosition: 0 | 1 | 2 | 3;
  playerData: PlayerRoundData[];
  isComplete: boolean;
}

export interface Game {
  id: string;
  players: Player[];
  rounds: Round[];
  currentRound: number; // 1-13
  dealerPosition: 0 | 1 | 2 | 3; // Rotates each round
  winner: string | null; // Player ID of winner
  createdAt: Date;
  isComplete: boolean;
}

export type GamePhase = 'bidding' | 'tricks' | 'complete';

export interface CurrentRoundState {
  phase: GamePhase;
  bids: Map<string, number>; // playerId -> bid
  tricks: Map<string, number>; // playerId -> tricks
  currentBidderIndex: number; // 0-3, index in bidding order
}

export interface GameState {
  game: Game | null;
  currentStep: 'home' | 'setup' | 'playing' | 'complete';
  roundState: CurrentRoundState | null;
}

// Helper to get bidding order (starts left of dealer, goes clockwise)
export const getBiddingOrder = (dealerPosition: number, players: Player[]): Player[] => {
  const order: Player[] = [];
  for (let i = 1; i <= 4; i++) {
    const position = (dealerPosition + i) % 4;
    const player = players.find(p => p.position === position);
    if (player) order.push(player);
  }
  return order;
};

// Calculate score for a player's round
export const calculatePlayerScore = (bid: number, tricks: number, roundNumber: number): number => {
  if (bid === 0) {
    // Nil bid
    if (tricks === 0) {
      // Made nil: score = round number
      return roundNumber;
    } else {
      // Failed nil: -1 per trick won
      return -tricks;
    }
  } else {
    // Non-zero bid
    if (tricks >= bid) {
      // Made bid: tricks × 2
      return tricks * 2;
    } else {
      // Failed bid: negative (bid × 2)
      return -(bid * 2);
    }
  }
};
