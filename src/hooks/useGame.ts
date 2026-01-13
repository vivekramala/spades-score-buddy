import { useState, useCallback } from 'react';
import { Game, Round, Player, GameState, CurrentRoundState, PlayerRoundData, calculatePlayerScore, getBiddingOrder } from '@/types/game';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    game: null,
    currentStep: 'home',
    roundState: null,
  });

  const startNewGame = useCallback((playerNames: string[], firstDistributor: number = 0) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: generateId(),
      name: name || `Player ${index + 1}`,
      position: index as 0 | 1 | 2 | 3,
      totalScore: 0,
    }));

    const game: Game = {
      id: generateId(),
      players,
      rounds: [],
      currentRound: 1,
      dealerPosition: firstDistributor as 0 | 1 | 2 | 3, // User-selected first distributor
      winner: null,
      createdAt: new Date(),
      isComplete: false,
    };

    // Initialize round state for bidding
    const roundState: CurrentRoundState = {
      phase: 'bidding',
      bids: new Map(),
      tricks: new Map(),
      currentBidderIndex: 0,
    };

    setGameState({
      game,
      currentStep: 'playing',
      roundState,
    });
  }, []);

  const submitBid = useCallback((playerId: string, bid: number) => {
    setGameState(prev => {
      if (!prev.game || !prev.roundState) return prev;

      const newBids = new Map(prev.roundState.bids);
      newBids.set(playerId, bid);

      const biddingOrder = getBiddingOrder(prev.game.dealerPosition, prev.game.players);
      const nextBidderIndex = prev.roundState.currentBidderIndex + 1;

      // Check if all bids are in
      if (nextBidderIndex >= 4) {
        return {
          ...prev,
          roundState: {
            ...prev.roundState,
            bids: newBids,
            phase: 'tricks',
            currentBidderIndex: 0,
          },
        };
      }

      return {
        ...prev,
        roundState: {
          ...prev.roundState,
          bids: newBids,
          currentBidderIndex: nextBidderIndex,
        },
      };
    });
  }, []);

  const submitTricks = useCallback((tricksData: Map<string, number>) => {
    setGameState(prev => {
      if (!prev.game || !prev.roundState) return prev;

      const roundNumber = prev.game.currentRound;
      const bids = prev.roundState.bids;

      // Calculate scores for each player
      const playerData: PlayerRoundData[] = prev.game.players.map(player => {
        const bid = bids.get(player.id) || 0;
        const tricks = tricksData.get(player.id) || 0;
        const score = calculatePlayerScore(bid, tricks, roundNumber);
        return {
          playerId: player.id,
          bid,
          tricks,
          score,
        };
      });

      // Create the round
      const newRound: Round = {
        id: generateId(),
        roundNumber,
        cardsPerPlayer: roundNumber,
        dealerPosition: prev.game.dealerPosition,
        playerData,
        isComplete: true,
      };

      // Update player total scores
      const updatedPlayers = prev.game.players.map(player => {
        const data = playerData.find(d => d.playerId === player.id);
        return {
          ...player,
          totalScore: player.totalScore + (data?.score || 0),
        };
      });

      const updatedRounds = [...prev.game.rounds, newRound];
      const nextRound = roundNumber + 1;
      const isComplete = nextRound > 13;

      // Determine winner if game is complete
      let winner: string | null = null;
      if (isComplete) {
        const sortedPlayers = [...updatedPlayers].sort((a, b) => b.totalScore - a.totalScore);
        winner = sortedPlayers[0].id;
      }

      // Rotate dealer for next round
      const nextDealerPosition = ((prev.game.dealerPosition + 1) % 4) as 0 | 1 | 2 | 3;

      const updatedGame: Game = {
        ...prev.game,
        players: updatedPlayers,
        rounds: updatedRounds,
        currentRound: nextRound,
        dealerPosition: nextDealerPosition,
        winner,
        isComplete,
      };

      // Initialize next round state or mark complete
      const newRoundState: CurrentRoundState | null = isComplete
        ? null
        : {
            phase: 'bidding',
            bids: new Map(),
            tricks: new Map(),
            currentBidderIndex: 0,
          };

      return {
        game: updatedGame,
        currentStep: isComplete ? 'complete' : 'playing',
        roundState: newRoundState,
      };
    });
  }, []);

  const undoLastRound = useCallback(() => {
    setGameState(prev => {
      if (!prev.game || prev.game.rounds.length === 0) return prev;

      const lastRound = prev.game.rounds[prev.game.rounds.length - 1];
      const updatedRounds = prev.game.rounds.slice(0, -1);

      // Revert player scores
      const updatedPlayers = prev.game.players.map(player => {
        const data = lastRound.playerData.find(d => d.playerId === player.id);
        return {
          ...player,
          totalScore: player.totalScore - (data?.score || 0),
        };
      });

      // Revert dealer and round number
      const prevDealerPosition = ((prev.game.dealerPosition - 1 + 4) % 4) as 0 | 1 | 2 | 3;

      const updatedGame: Game = {
        ...prev.game,
        players: updatedPlayers,
        rounds: updatedRounds,
        currentRound: lastRound.roundNumber,
        dealerPosition: prevDealerPosition,
        winner: null,
        isComplete: false,
      };

      // Reset to bidding phase for this round
      const roundState: CurrentRoundState = {
        phase: 'bidding',
        bids: new Map(),
        tricks: new Map(),
        currentBidderIndex: 0,
      };

      return {
        game: updatedGame,
        currentStep: 'playing',
        roundState,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      game: null,
      currentStep: 'home',
      roundState: null,
    });
  }, []);

  const goToSetup = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentStep: 'setup',
    }));
  }, []);

  // Validate if a bid is allowed
  const validateBid = useCallback((bid: number, isLastBidder: boolean, currentBidsSum: number, roundNumber: number): { valid: boolean; message?: string } => {
    if (bid < 0 || bid > 13) {
      return { valid: false, message: 'Bid must be between 0 and 13' };
    }
    if (!Number.isInteger(bid)) {
      return { valid: false, message: 'Bid must be a whole number' };
    }
    if (isLastBidder && currentBidsSum + bid === roundNumber) {
      return { valid: false, message: `Total bids cannot equal ${roundNumber}. Choose another bid.` };
    }
    return { valid: true };
  }, []);

  return {
    gameState,
    startNewGame,
    submitBid,
    submitTricks,
    undoLastRound,
    resetGame,
    goToSetup,
    validateBid,
  };
};
