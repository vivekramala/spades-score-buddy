import { Player } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RoundStartModalProps {
  open: boolean;
  roundNumber: number;
  distributor: Player | undefined;
  firstBidder: Player | undefined;
  onReady: () => void;
}

export const RoundStartModal = ({
  open,
  roundNumber,
  distributor,
  firstBidder,
  onReady,
}: RoundStartModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="card-surface border-gold/30 max-w-md" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center animate-pulse-gold">
            <SpadeIcon size="md" className="text-spade-black" />
          </div>
          <DialogTitle className="font-display text-2xl gold-text">
            Round {roundNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="my-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Layers className="w-4 h-4" />
            <span className="text-sm">{roundNumber} card{roundNumber > 1 ? 's' : ''} per player</span>
          </div>

          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Distributor</p>
            <p className="font-display text-xl font-bold">{distributor?.name}</p>
          </div>

          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">First to Bid</p>
            <p className="font-display text-xl font-bold text-gold">{firstBidder?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">Bidding goes clockwise</p>
          </div>
        </div>

        <button
          onClick={onReady}
          className="btn-primary w-full py-4 rounded-xl text-lg"
        >
          Ready for Bidding
        </button>
      </DialogContent>
    </Dialog>
  );
};
