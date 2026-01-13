import { SpadeIcon } from './SpadeIcon';
import { Users, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface StartGameModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  playerNames: string[];
}

export const StartGameModal = ({
  open,
  onConfirm,
  onCancel,
  playerNames,
}: StartGameModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="card-surface border-gold/30 max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center animate-pulse-gold">
            <SpadeIcon size="md" className="text-spade-black" />
          </div>
          <DialogTitle className="font-display text-2xl gold-text">
            Ready to Play?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Game will begin with Round 1
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-sm text-muted-foreground">Players</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  index === 0
                    ? 'bg-gold/20 border border-gold/30'
                    : 'bg-secondary/30'
                }`}
              >
                <p className="font-semibold truncate">{name || `Player ${index + 1}`}</p>
                {index === 0 && (
                  <p className="text-xs text-gold">First Distributor</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 py-3 rounded-xl"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary flex-1 py-3 rounded-xl"
          >
            <Play className="w-5 h-5" />
            Start Game
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
