import { useState, useEffect } from 'react';
import { Player, getBiddingOrder } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { Minus, Plus, Check, AlertCircle } from 'lucide-react';

interface BidEntryProps {
  players: Player[];
  dealerPosition: number;
  roundNumber: number;
  currentBids: Map<string, number>;
  currentBidderIndex: number;
  onSubmitBid: (playerId: string, bid: number) => void;
  validateBid: (bid: number, isLastBidder: boolean, currentBidsSum: number, roundNumber: number) => { valid: boolean; message?: string };
}

export const BidEntry = ({
  players,
  dealerPosition,
  roundNumber,
  currentBids,
  currentBidderIndex,
  onSubmitBid,
  validateBid,
}: BidEntryProps) => {
  const [bid, setBid] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const biddingOrder = getBiddingOrder(dealerPosition, players);
  const currentBidder = biddingOrder[currentBidderIndex];
  const dealer = players.find(p => p.position === dealerPosition);

  // Calculate current sum of bids
  const currentBidsSum = Array.from(currentBids.values()).reduce((sum, b) => sum + b, 0);
  const isLastBidder = currentBidderIndex === 3;

  // Reset bid when bidder changes
  useEffect(() => {
    setBid(0);
    setError(null);
  }, [currentBidderIndex]);

  const handleBidChange = (newBid: number) => {
    const clampedBid = Math.max(0, Math.min(13, newBid)); // Always allow 0-13
    setBid(clampedBid);
    
    // Validate immediately for last bidder
    if (isLastBidder) {
      const validation = validateBid(clampedBid, true, currentBidsSum, roundNumber);
      setError(validation.valid ? null : validation.message || null);
    } else {
      setError(null);
    }
  };

  const handleSubmit = () => {
    const validation = validateBid(bid, isLastBidder, currentBidsSum, roundNumber);
    if (!validation.valid) {
      setError(validation.message || 'Invalid bid');
      return;
    }
    onSubmitBid(currentBidder.id, bid);
  };

  return (
    <div className="card-surface p-6 animate-slide-up">
      {/* Header with distributor info */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full mb-4">
          <SpadeIcon size="sm" className="text-gold" />
          <span className="text-sm text-muted-foreground">
            Distributor: <span className="font-semibold text-foreground">{dealer?.name}</span>
          </span>
        </div>
        <h2 className="font-display text-xl font-bold text-gold">Bidding Phase</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Bids so far: {currentBidsSum} / {roundNumber} cards
        </p>
      </div>

      {/* Previously submitted bids */}
      {currentBids.size > 0 && (
        <div className="mb-6 p-4 bg-secondary/30 rounded-xl">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Submitted Bids</h3>
          <div className="grid grid-cols-2 gap-2">
            {biddingOrder.slice(0, currentBidderIndex).map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2 bg-card rounded-lg">
                <span className="text-sm truncate">{player.name}</span>
                <span className="font-semibold text-gold">{currentBids.get(player.id)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current bidder input */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">
          {isLastBidder ? 'Final bid from:' : 'Enter bid for:'}
        </p>
        <h3 className="font-display text-2xl font-bold">{currentBidder?.name}</h3>
        {isLastBidder && (
          <p className="text-xs text-warning mt-2 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Cannot bid {roundNumber - currentBidsSum} (would equal {roundNumber})
          </p>
        )}
      </div>

      {/* Bid input */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => handleBidChange(bid - 1)}
          className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center transition-colors hover:bg-secondary active:scale-95"
          disabled={bid <= 0}
        >
          <Minus className="w-6 h-6" />
        </button>
        <div className="w-24 h-20 rounded-xl bg-card border-2 border-gold flex items-center justify-center">
          <span className="font-display text-4xl font-bold text-gold">{bid}</span>
        </div>
        <button
          type="button"
          onClick={() => handleBidChange(bid + 1)}
          className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center transition-colors hover:bg-secondary active:scale-95"
          disabled={bid >= 13}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Quick bid buttons - always show 0-13 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Array.from({ length: 14 }, (_, i) => i).map((n) => {
          const isDisabled = isLastBidder && currentBidsSum + n === roundNumber;
          return (
            <button
              key={n}
              type="button"
              onClick={() => !isDisabled && handleBidChange(n)}
              disabled={isDisabled}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                bid === n
                  ? 'gold-gradient text-spade-black'
                  : isDisabled
                  ? 'bg-secondary/30 text-muted-foreground/50 cursor-not-allowed'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-center text-destructive text-sm mb-4 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!!error}
        className="btn-primary w-full py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-5 h-5" />
        Submit Bid
      </button>
    </div>
  );
};
