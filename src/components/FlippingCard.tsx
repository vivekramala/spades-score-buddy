import { useState, useEffect } from 'react';
import { Player, getBiddingOrder, PlayerRoundData } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { Crown, Trophy, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';

interface FlippingCardProps {
  // For back side (pre-bid)
  distributor: Player | undefined;
  firstBidder: Player | undefined;
  roundNumber: number;
  // For front side (post-round results)
  showResults: boolean;
  roundWinner?: { player: Player; score: number } | null;
  highestScorer?: { player: Player; totalScore: number } | null;
  onResultsComplete?: () => void;
}

export const FlippingCard = ({
  distributor,
  firstBidder,
  roundNumber,
  showResults,
  roundWinner,
  highestScorer,
  onResultsComplete,
}: FlippingCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showResults && roundWinner) {
      setIsFlipped(true);
      setShowConfetti(true);
      
      // Auto-flip back after 2 seconds
      const timer = setTimeout(() => {
        setIsFlipped(false);
        setShowConfetti(false);
        onResultsComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
      setShowConfetti(false);
    }
  }, [showResults, roundWinner, onResultsComplete]);

  return (
    <div className="relative perspective-1000">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={100}
            gravity={0.3}
            colors={['#d4af37', '#f5e6a3', '#b8860b', '#ffd700']}
          />
        </div>
      )}
      
      <div
        className={`relative w-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Back Side - Pre-Bid Info */}
        <div
          className="card-surface p-6 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center animate-pulse-gold">
              <SpadeIcon size="md" className="text-spade-black" />
            </div>
            
            <h2 className="font-display text-2xl font-bold gold-text mb-6">
              Round {roundNumber}
            </h2>

            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Distributor</p>
                <p className="font-display text-xl font-bold">{distributor?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Distributes {roundNumber} card{roundNumber > 1 ? 's' : ''} to each player
                </p>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">First to Bid</p>
                <p className="font-display text-xl font-bold text-gold">{firstBidder?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bidding goes clockwise
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Front Side - Round Results */}
        <div
          className="card-surface p-6 absolute inset-0 backface-hidden rotate-y-180"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center">
              <Trophy className="w-8 h-8 text-spade-black" />
            </div>

            <h2 className="font-display text-2xl font-bold gold-text mb-6">
              Round {roundNumber} Complete!
            </h2>

            {roundWinner && (
              <div className="bg-gold/20 border border-gold/50 rounded-xl p-4 mb-4 animate-slide-up">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-gold" />
                  <p className="text-sm text-gold font-semibold">Round Winner</p>
                  <Crown className="w-5 h-5 text-gold" />
                </div>
                <p className="font-display text-2xl font-bold">{roundWinner.player.name}</p>
                <p className="text-lg font-semibold text-gold">+{roundWinner.score} points</p>
              </div>
            )}

            {highestScorer && (
              <div className="bg-secondary/30 rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <p className="text-sm text-muted-foreground">Current Leader</p>
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
                <p className="font-display text-xl font-bold">{highestScorer.player.name}</p>
                <p className="text-muted-foreground">{highestScorer.totalScore} total points</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
