import { useState } from 'react';
import { SpadeIcon } from './SpadeIcon';
import { Users, Play, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StartGameModalProps {
  open: boolean;
  onConfirm: (firstDistributor: number) => void;
  onCancel: () => void;
  playerNames: string[];
}

export const StartGameModal = ({
  open,
  onConfirm,
  onCancel,
  playerNames,
}: StartGameModalProps) => {
  const [selectedDistributor, setSelectedDistributor] = useState(0);

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

        <div className="my-6 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-sm text-muted-foreground">Players</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  index === selectedDistributor
                    ? 'bg-gold/20 border border-gold/30'
                    : 'bg-secondary/30'
                }`}
              >
                <p className="font-semibold truncate">{name || `Player ${index + 1}`}</p>
                {index === selectedDistributor && (
                  <p className="text-xs text-gold">First Distributor</p>
                )}
              </div>
            ))}
          </div>

          {/* Distributor Selection */}
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Select First Distributor</p>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/50 transition-colors">
                <span className="font-semibold">{playerNames[selectedDistributor]}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {playerNames.map((name, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => setSelectedDistributor(index)}
                    className={selectedDistributor === index ? 'bg-gold/20' : ''}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            onClick={() => onConfirm(selectedDistributor)}
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
