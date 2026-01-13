export interface Player {
  id: string;
  name: string;
  teamId: 'A' | 'B';
}

export interface Team {
  id: 'A' | 'B';
  name: string;
  players: Player[];
  totalScore: number;
  totalBags: number;
}

export interface Round {
  id: string;
  roundNumber: number;
  teamABid: number;
  teamATricks: number;
  teamAScore: number;
  teamABags: number;
  teamBBid: number;
  teamBTricks: number;
  teamBScore: number;
  teamBBags: number;
}

export interface Game {
  id: string;
  players: Player[];
  teams: {
    A: Team;
    B: Team;
  };
  rounds: Round[];
  targetScore: number;
  bagPenaltyThreshold: number;
  winner: 'A' | 'B' | null;
  createdAt: Date;
  isComplete: boolean;
}

export interface GameState {
  game: Game | null;
  currentStep: 'home' | 'setup' | 'playing' | 'complete';
}
