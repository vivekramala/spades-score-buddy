import { useState, useEffect, useCallback } from 'react';
import { Game, CurrentRoundState, getBiddingOrder, PlayerRoundData } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { BidEntry } from './BidEntry';
import { TricksEntry } from './TricksEntry';
import { FlippingCard } from './FlippingCard';
import { RotateCcw, Home, Crown, Layers } from 'lucide-react';

interface GameScreenProps {
  game: Game;
  roundState: CurrentRoundState;
  onSubmitBid: (playerId: string, bid: number) => void;
  onSubmitTricks: (tricks: Map<string, number>) => void;
  onUndo: () => void;
  onEndGame: () => void;
  validateBid: (bid: number, isLastBidder: boolean, currentBidsSum: number, roundNumber: number) => { valid: boolean; message?: string };
}

export const GameScreen = ({
  game,
  roundState,
  onSubmitBid,
  onSubmitTricks,
  onUndo,
  onEndGame,
  validateBid,
}: GameScreenProps) => {
  const [showRoundResults, setShowRoundResults] = useState(false);
  const [lastRoundResults, setLastRoundResults] = useState<{
    roundNumber: number;
    roundWinner: { player: typeof game.players[0]; score: number } | null;
    highestScorer: { player: typeof game.players[0]; totalScore: number } | null;
  } | null>(null);

  const currentRound = game.currentRound;
  const distributor = game.players.find(p => p.position === game.dealerPosition);
  const biddingOrder = getBiddingOrder(game.dealerPosition, game.players);
  const firstBidder = biddingOrder[0];

  // Sort players by score for leaderboard
  const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);

  // Handle tricks submission with results display
  const handleSubmitTricks = useCallback((tricks: Map<string, number>) => {
    // Calculate what the results will be before submission
    const roundNumber = game.currentRound;
    const bids = roundState.bids;
    
    // Calculate scores for display
    let maxScore = -Infinity;
    let roundWinnerData: { player: typeof game.players[0]; score: number } | null = null;
    
    game.players.forEach(player => {
      const bid = bids.get(player.id) || 0;
      const playerTricks = tricks.get(player.id) || 0;
      
      // Calculate score using same logic
      let score: number;
      if (bid === 0) {
        score = playerTricks === 0 ? roundNumber : -roundNumber;
      } else {
        if (playerTricks >= bid) {
          score = (bid * 2) + (playerTricks - bid);
        } else {
          score = -bid;
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        roundWinnerData = { player, score };
      }
    });

    // Calculate updated totals for highest scorer
    const updatedTotals = game.players.map(player => {
      const bid = bids.get(player.id) || 0;
      const playerTricks = tricks.get(player.id) || 0;
      
      let score: number;
      if (bid === 0) {
        score = playerTricks === 0 ? roundNumber : -roundNumber;
      } else {
        if (playerTricks >= bid) {
          score = (bid * 2) + (playerTricks - bid);
        } else {
          score = -bid;
        }
      }
      
      return { player, totalScore: player.totalScore + score };
    });

    const highestScorer = updatedTotals.reduce((max, curr) => 
      curr.totalScore > max.totalScore ? curr : max
    );

    setLastRoundResults({
      roundNumber,
      roundWinner: roundWinnerData,
      highestScorer: { player: highestScorer.player, totalScore: highestScorer.totalScore },
    });
    setShowRoundResults(true);

    // Actually submit the tricks
    onSubmitTricks(tricks);
  }, [game, roundState.bids, onSubmitTricks]);

  const handleResultsComplete = useCallback(() => {
    setShowRoundResults(false);
    setLastRoundResults(null);
  }, []);

  return (
    <div className="min-h-screen felt-texture flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <SpadeIcon size="sm" className="text-spade-black" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gold-text">
                Round {currentRound} of 13
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Layers className="w-3 h-3" />
                <span>{currentRound} cards each</span>
              </div>
            </div>
          </div>
          <button
            onClick={onEndGame}
            className="btn-secondary p-2 rounded-lg"
            aria-label="End game"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Round Info Banner */}
      <div className="bg-secondary/30 p-3 border-b border-border/30">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Distributor:</span>
            <span className="font-semibold">{distributor?.name}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">First to bid:</span>
            <span className="font-semibold">{firstBidder?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* Left: Score Entry or Flipping Card */}
          <div>
            {showRoundResults && lastRoundResults ? (
              <FlippingCard
                distributor={distributor}
                firstBidder={firstBidder}
                roundNumber={lastRoundResults.roundNumber}
                showResults={true}
                roundWinner={lastRoundResults.roundWinner}
                highestScorer={lastRoundResults.highestScorer}
                onResultsComplete={handleResultsComplete}
              />
            ) : roundState.phase === 'bidding' ? (
              <>
                {/* Show flipping card on back side for pre-bid info */}
                <div className="mb-4">
                  <FlippingCard
                    distributor={distributor}
                    firstBidder={firstBidder}
                    roundNumber={currentRound}
                    showResults={false}
                    roundWinner={null}
                    highestScorer={null}
                  />
                </div>
                <BidEntry
                  players={game.players}
                  dealerPosition={game.dealerPosition}
                  roundNumber={currentRound}
                  currentBids={roundState.bids}
                  currentBidderIndex={roundState.currentBidderIndex}
                  onSubmitBid={onSubmitBid}
                  validateBid={validateBid}
                />
              </>
            ) : (
              <TricksEntry
                players={game.players}
                bids={roundState.bids}
                roundNumber={currentRound}
                onSubmitTricks={handleSubmitTricks}
              />
            )}
          </div>

          {/* Right: Leaderboard */}
          <div className="space-y-4">
            {/* Current Standings */}
            <div className="card-surface p-4">
              <h2 className="font-display text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Standings
              </h2>
              <div className="space-y-2">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? 'bg-gold/10 border border-gold/30' : 'bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'gold-gradient text-spade-black' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className={`font-display text-xl font-bold ${
                      player.totalScore < 0 ? 'text-destructive' : index === 0 ? 'text-gold' : ''
                    }`}>
                      {player.totalScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Round History */}
            {game.rounds.length > 0 && (
              <div className="card-surface p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-semibold text-gold">
                    History
                  </h2>
                  <button
                    onClick={onUndo}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Undo
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-2 text-left text-muted-foreground font-medium">Rd</th>
                        {game.players.map((player) => (
                          <th key={player.id} className="py-2 px-2 text-center text-muted-foreground font-medium truncate max-w-[60px]">
                            {player.name.split(' ')[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {game.rounds.slice().reverse().slice(0, 5).map((round) => (
                        <tr key={round.id} className="border-b border-border/30">
                          <td className="py-2 px-2 font-medium">{round.roundNumber}</td>
                          {game.players.map((player) => {
                            const data = round.playerData.find(d => d.playerId === player.id);
                            if (!data) return <td key={player.id} className="py-2 px-2">-</td>;
                            return (
                              <td key={player.id} className="py-2 px-2 text-center">
                                <div className="text-xs text-muted-foreground">{data.bid}/{data.tricks}</div>
                                <div className={`font-semibold ${data.score >= 0 ? 'text-success' : 'text-destructive'}`}>
                                  {data.score > 0 ? '+' : ''}{data.score}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {game.rounds.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Showing last 5 rounds
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
