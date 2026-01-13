import { Player } from '@/types/game';
import { Crown, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Sort players by total score for display
  const sortedScores = [...allPlayerScores].sort((a, b) => b.totalScore - a.totalScore);
  const leaderId = highestScorer?.player.id;

  useEffect(() => {
    if (open) {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open}>
      {/* Confetti layer - outside DialogContent so it covers full screen */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={150}
            gravity={0.25}
            initialVelocityY={15}
            colors={['#d4af37', '#f5e6a3', '#b8860b', '#ffd700', '#fff8e7']}
          />
        </div>
      )}
      
      <DialogContent 
        className="card-surface border-gold/30 max-w-md animate-card-flip-in" 
        hideCloseButton
      >
        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center">
            <Trophy className="w-8 h-8 text-spade-black" />
          </div>
          <DialogTitle className="font-display text-2xl gold-text text-center w-full">
            Round {roundNumber} Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="my-4 space-y-4">
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
          className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2"
        >
          {isLastRound ? 'View Final Results' : 'Ready for Next Round'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
};
