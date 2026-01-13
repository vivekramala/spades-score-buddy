import { Game } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { Trophy, RotateCcw, Home, Medal, Crown, Sparkles, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

interface WinnerScreenProps {
  game: Game;
  onNewGame: () => void;
  onHome: () => void;
}

export const WinnerScreen = ({ game, onNewGame, onHome }: WinnerScreenProps) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [showSecondWave, setShowSecondWave] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Second wave of confetti
    const timer1 = setTimeout(() => setShowSecondWave(true), 1500);
    const timer2 = setTimeout(() => setShowConfetti(false), 8000);
    const timer3 = setTimeout(() => setShowSecondWave(false), 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Sort players by final score
  const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];
  
  // Check for ties at the top
  const winners = sortedPlayers.filter(p => p.totalScore === winner.totalScore);

  return (
    <div className="min-h-screen felt-texture flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Multiple confetti layers for more celebration */}
      {showConfetti && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.2}
            initialVelocityY={20}
            colors={['#D4A418', '#F4D03F', '#2D5016', '#FFF8E7', '#ffd700', '#b8860b']}
          />
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={100}
            gravity={0.1}
            wind={0.02}
            colors={['#ffffff', '#f5e6a3', '#d4af37']}
            drawShape={ctx => {
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                const x = Math.cos(angle) * 5;
                const y = Math.sin(angle) * 5;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
            }}
          />
        </>
      )}
      {showSecondWave && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#D4A418', '#F4D03F', '#ffd700']}
        />
      )}

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-10 left-10 w-8 h-8 text-gold animate-sparkle" />
        <Star className="absolute top-20 right-16 w-6 h-6 text-gold-light animate-sparkle" style={{ animationDelay: '0.3s' }} />
        <Sparkles className="absolute bottom-32 left-16 w-6 h-6 text-gold animate-sparkle" style={{ animationDelay: '0.6s' }} />
        <Star className="absolute bottom-20 right-10 w-8 h-8 text-gold-light animate-sparkle" style={{ animationDelay: '0.9s' }} />
        <Crown className="absolute top-32 left-1/4 w-10 h-10 text-gold/30 animate-crown-float" />
        <Crown className="absolute bottom-40 right-1/4 w-8 h-8 text-gold/30 animate-crown-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="text-center animate-winner-entrance max-w-md w-full relative z-10">
        {/* Trophy with glow effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gold/20 animate-pulse-gold" />
          </div>
          <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full gold-gradient animate-trophy-bounce">
            <Trophy className="w-16 h-16 text-spade-black" />
          </div>
          {/* Floating crowns around trophy */}
          <Crown className="absolute -top-2 -left-4 w-8 h-8 text-gold animate-crown-float" />
          <Crown className="absolute -top-2 -right-4 w-8 h-8 text-gold animate-crown-float" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Winner Announcement */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-gold animate-sparkle" />
            <span className="text-sm uppercase tracking-widest text-gold/80">Champion{winners.length > 1 ? 's' : ''}</span>
            <Sparkles className="w-6 h-6 text-gold animate-sparkle" style={{ animationDelay: '0.3s' }} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold gold-text mb-2">
            {winners.length > 1 
              ? winners.map(w => w.name).join(' & ')
              : winner.name
            } 
          </h1>
          <p className="text-lg text-gold/80">Win{winners.length > 1 ? '' : 's'}!</p>
        </div>

        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gold/20 border border-gold/40 mb-6">
          <Trophy className="w-5 h-5 text-gold" />
          <span className="text-2xl font-display font-bold text-gold">{winner.totalScore}</span>
          <span className="text-gold/80">points</span>
        </div>

        {/* Final Standings */}
        <div className="team-card my-6">
          <h2 className="font-display text-lg font-semibold text-gold mb-4 flex items-center justify-center gap-2">
            <Medal className="w-5 h-5" />
            Final Standings
          </h2>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  index === 0 ? 'bg-gold/20 border-2 border-gold/50 shadow-lg' : 'bg-secondary/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'gold-gradient text-spade-black shadow-lg' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {index === 0 ? <Crown className="w-5 h-5" /> : index + 1}
                  </span>
                  <span className={`font-medium text-lg ${index === 0 ? 'text-gold font-semibold' : ''}`}>
                    {player.name}
                  </span>
                </div>
                <span className={`font-display text-2xl font-bold ${
                  player.totalScore < 0 ? 'text-destructive' : index === 0 ? 'text-gold' : ''
                }`}>
                  {player.totalScore}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="p-3 rounded-lg bg-gold/10">
                <p className="font-semibold text-xl text-gold">{game.rounds.length}</p>
                <p className="opacity-60">Rounds Played</p>
              </div>
              <div className="p-3 rounded-lg bg-gold/10">
                <p className="font-semibold text-xl text-gold">
                  {sortedPlayers.length > 1 ? sortedPlayers[0].totalScore - sortedPlayers[1].totalScore : 0}
                </p>
                <p className="opacity-60">Winning Margin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button onClick={onHome} className="btn-secondary flex-1 py-4">
            <Home className="w-5 h-5" />
            Home
          </button>
          <button onClick={onNewGame} className="btn-primary flex-1 py-4">
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
