import { useState, useCallback } from 'react';
import { Game, Round, Player, GameState } from '@/types/game';

const generateId = () => Math.random().toString(36).substring(2, 9);

const calculateRoundScore = (bid: number, tricks: number): { score: number; bags: number } => {
  if (tricks >= bid) {
    const bags = tricks - bid;
    const score = bid * 10 + bags;
    return { score, bags };
  } else {
    // Set - negative points equal to bid * 10
    return { score: -(bid * 10), bags: 0 };
  }
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    game: null,
    currentStep: 'home',
  });

  const startNewGame = useCallback((
    playerNames: string[],
    targetScore: number = 500,
    bagPenaltyThreshold: number = 10
  ) => {
    const players: Player[] = [
      { id: generateId(), name: playerNames[0] || 'Player 1', teamId: 'A' },
      { id: generateId(), name: playerNames[1] || 'Player 2', teamId: 'B' },
      { id: generateId(), name: playerNames[2] || 'Player 3', teamId: 'A' },
      { id: generateId(), name: playerNames[3] || 'Player 4', teamId: 'B' },
    ];

    const game: Game = {
      id: generateId(),
      players,
      teams: {
        A: {
          id: 'A',
          name: 'Team A',
          players: players.filter(p => p.teamId === 'A'),
          totalScore: 0,
          totalBags: 0,
        },
        B: {
          id: 'B',
          name: 'Team B',
          players: players.filter(p => p.teamId === 'B'),
          totalScore: 0,
          totalBags: 0,
        },
      },
      rounds: [],
      targetScore,
      bagPenaltyThreshold,
      winner: null,
      createdAt: new Date(),
      isComplete: false,
    };

    setGameState({
      game,
      currentStep: 'playing',
    });
  }, []);

  const addRound = useCallback((
    teamABid: number,
    teamATricks: number,
    teamBBid: number,
    teamBTricks: number
  ) => {
    setGameState(prev => {
      if (!prev.game) return prev;

      const teamAResult = calculateRoundScore(teamABid, teamATricks);
      const teamBResult = calculateRoundScore(teamBBid, teamBTricks);

      const newRound: Round = {
        id: generateId(),
        roundNumber: prev.game.rounds.length + 1,
        teamABid,
        teamATricks,
        teamAScore: teamAResult.score,
        teamABags: teamAResult.bags,
        teamBBid,
        teamBTricks,
        teamBScore: teamBResult.score,
        teamBBags: teamBResult.bags,
      };

      const updatedRounds = [...prev.game.rounds, newRound];

      // Calculate totals
      let teamATotalScore = 0;
      let teamATotalBags = 0;
      let teamBTotalScore = 0;
      let teamBTotalBags = 0;

      updatedRounds.forEach(round => {
        teamATotalScore += round.teamAScore;
        teamATotalBags += round.teamABags;
        teamBTotalScore += round.teamBScore;
        teamBTotalBags += round.teamBBags;
      });

      // Apply bag penalties
      const teamABagPenalties = Math.floor(teamATotalBags / prev.game.bagPenaltyThreshold);
      const teamBBagPenalties = Math.floor(teamBTotalBags / prev.game.bagPenaltyThreshold);

      teamATotalScore -= teamABagPenalties * 100;
      teamBTotalScore -= teamBBagPenalties * 100;

      // Check for winner
      let winner: 'A' | 'B' | null = null;
      let isComplete = false;

      if (teamATotalScore >= prev.game.targetScore || teamBTotalScore >= prev.game.targetScore) {
        if (teamATotalScore >= prev.game.targetScore && teamBTotalScore >= prev.game.targetScore) {
          winner = teamATotalScore >= teamBTotalScore ? 'A' : 'B';
        } else {
          winner = teamATotalScore >= prev.game.targetScore ? 'A' : 'B';
        }
        isComplete = true;
      }

      const updatedGame: Game = {
        ...prev.game,
        rounds: updatedRounds,
        teams: {
          A: {
            ...prev.game.teams.A,
            totalScore: teamATotalScore,
            totalBags: teamATotalBags,
          },
          B: {
            ...prev.game.teams.B,
            totalScore: teamBTotalScore,
            totalBags: teamBTotalBags,
          },
        },
        winner,
        isComplete,
      };

      return {
        game: updatedGame,
        currentStep: isComplete ? 'complete' : 'playing',
      };
    });
  }, []);

  const undoLastRound = useCallback(() => {
    setGameState(prev => {
      if (!prev.game || prev.game.rounds.length === 0) return prev;

      const updatedRounds = prev.game.rounds.slice(0, -1);

      // Recalculate totals
      let teamATotalScore = 0;
      let teamATotalBags = 0;
      let teamBTotalScore = 0;
      let teamBTotalBags = 0;

      updatedRounds.forEach(round => {
        teamATotalScore += round.teamAScore;
        teamATotalBags += round.teamABags;
        teamBTotalScore += round.teamBScore;
        teamBTotalBags += round.teamBBags;
      });

      const teamABagPenalties = Math.floor(teamATotalBags / prev.game.bagPenaltyThreshold);
      const teamBBagPenalties = Math.floor(teamBTotalBags / prev.game.bagPenaltyThreshold);

      teamATotalScore -= teamABagPenalties * 100;
      teamBTotalScore -= teamBBagPenalties * 100;

      const updatedGame: Game = {
        ...prev.game,
        rounds: updatedRounds,
        teams: {
          A: {
            ...prev.game.teams.A,
            totalScore: teamATotalScore,
            totalBags: teamATotalBags,
          },
          B: {
            ...prev.game.teams.B,
            totalScore: teamBTotalScore,
            totalBags: teamBTotalBags,
          },
        },
        winner: null,
        isComplete: false,
      };

      return {
        game: updatedGame,
        currentStep: 'playing',
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      game: null,
      currentStep: 'home',
    });
  }, []);

  const goToSetup = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentStep: 'setup',
    }));
  }, []);

  return {
    gameState,
    startNewGame,
    addRound,
    undoLastRound,
    resetGame,
    goToSetup,
  };
};
