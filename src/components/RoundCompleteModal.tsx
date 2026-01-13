import { Player } from '@/types/game';
import { Crown, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RoundCompleteModalProps {
  open: boolean;
  roundNumber: number;
  roundWinners: { player: Player; score: number }[];
  allPlayerScores: { player: Player; score: number; totalScore: number }[];
  highestScorer: { player: Player; totalScore: number } | null;
  isLastRound: boolean;
  onNextRound: () => void;
}

export const RoundCompleteModal = ({
  open,
  roundNumber,
  roundWinners,
  allPlayerScores,
  highestScorer,
  isLastRound,
  onNextRound,
}: RoundCompleteModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [confettiDimensions, setConfettiDimensions] = useState({ width: 400, height: 500 });
  
  // Sort players by total score for display
  const sortedScores = [...allPlayerScores].sort((a, b) => b.totalScore - a.totalScore);
  const leaderId = highestScorer?.player.id;

  useEffect(() => {
    if (open && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setConfettiDimensions({
        width: rect.width,
        height: rect.height
      });
    }
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent 
        ref={cardRef}
        className="card-surface border-gold/30 max-w-md animate-card-flip-in overflow-hidden" 
        hideCloseButton
      >
        {open && (
          <div 
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          >
            <Confetti
              width={confettiDimensions.width}
              height={confettiDimensions.height}
              recycle={false}
              numberOfPieces={80}
              gravity={0.3}
              initialVelocityX={{ min: -5, max: 5 }}
              initialVelocityY={{ min: 0, max: 10 }}
              confettiSource={{ x: confettiDimensions.width / 2 - 50, y: 0, w: 100, h: 0 }}
              colors={['#d4af37', '#f5e6a3', '#b8860b', '#ffd700']}
            />
          </div>
        )}

        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center">
            <Trophy className="w-8 h-8 text-spade-black" />
          </div>
          <DialogTitle className="font-display text-2xl gold-text text-center w-full">
            Round {roundNumber} Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="my-4 space-y-4 relative z-20">
          {/* Round Winners */}
          {roundWinners.length > 0 && (
            <div className="bg-gold/20 border border-gold/50 rounded-xl p-4 animate-slide-up">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-gold" />
                <p className="text-sm text-gold font-semibold">
                  Round Winner{roundWinners.length > 1 ? 's' : ''}
                </p>
                <Crown className="w-5 h-5 text-gold" />
              </div>
              <div className="text-center">
                {roundWinners.map((winner, idx) => (
                  <span key={winner.player.id} className="font-display text-xl font-bold">
                    {winner.player.name}
                    {idx < roundWinners.length - 1 && <span className="text-gold mx-2">&</span>}
                  </span>
                ))}
              </div>
              <p className="text-lg font-semibold text-gold text-center">
                {roundWinners[0].score >= 0 ? '+' : ''}{roundWinners[0].score} points
              </p>
            </div>
          )}

          {/* All Player Scores */}
          <div className="bg-secondary/30 rounded-xl p-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <p className="text-sm text-muted-foreground">Current Standings</p>
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sortedScores.map((entry) => {
                const isLeader = entry.player.id === leaderId;
                return (
                  <div
                    key={entry.player.id}
                    className={`rounded-lg p-2 text-center ${
                      isLeader
                        ? 'bg-gold/20 border border-gold/40 col-span-2'
                        : 'bg-card/50 border border-border/30'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isLeader && <Crown className="w-3 h-3 text-gold" />}
                      <p className={`font-semibold text-sm ${isLeader ? 'text-gold' : ''}`}>
                        {entry.player.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className={`text-xs ${entry.score >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {entry.score >= 0 ? '+' : ''}{entry.score}
                      </span>
                      <span className={`font-display font-bold ${isLeader ? 'text-lg' : 'text-sm'}`}>
                        {entry.totalScore} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={onNextRound}
          className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2 relative z-20"
        >
          {isLastRound ? 'View Final Results' : 'Ready for Next Round'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
};
