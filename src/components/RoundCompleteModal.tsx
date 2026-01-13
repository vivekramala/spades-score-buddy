import { Player } from '@/types/game';
import { Crown, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RoundCompleteModalProps {
  open: boolean;
  roundNumber: number;
  roundWinner: { player: Player; score: number } | null;
  highestScorer: { player: Player; totalScore: number } | null;
  isLastRound: boolean;
  onNextRound: () => void;
}

export const RoundCompleteModal = ({
  open,
  roundNumber,
  roundWinner,
  highestScorer,
  isLastRound,
  onNextRound,
}: RoundCompleteModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="card-surface border-gold/30 max-w-md" hideCloseButton>
        {open && (
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

        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center">
            <Trophy className="w-8 h-8 text-spade-black" />
          </div>
          <DialogTitle className="font-display text-2xl gold-text">
            Round {roundNumber} Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="my-6 space-y-4">
          {roundWinner && (
            <div className="bg-gold/20 border border-gold/50 rounded-xl p-4 animate-slide-up">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-gold" />
                <p className="text-sm text-gold font-semibold">Round Winner</p>
                <Crown className="w-5 h-5 text-gold" />
              </div>
              <p className="font-display text-2xl font-bold text-center">{roundWinner.player.name}</p>
              <p className="text-lg font-semibold text-gold text-center">
                {roundWinner.score >= 0 ? '+' : ''}{roundWinner.score} points
              </p>
            </div>
          )}

          {highestScorer && (
            <div className="bg-secondary/30 rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <p className="text-sm text-muted-foreground">Current Leader</p>
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <p className="font-display text-xl font-bold text-center">{highestScorer.player.name}</p>
              <p className="text-muted-foreground text-center">{highestScorer.totalScore} total points</p>
            </div>
          )}
        </div>

        <button
          onClick={onNextRound}
          className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2"
        >
          {isLastRound ? 'View Final Results' : 'Ready for Next Round'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
};
