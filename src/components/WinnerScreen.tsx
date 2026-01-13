import { Game } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { Trophy, RotateCcw, Home } from 'lucide-react';
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

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const winningTeam = game.winner ? game.teams[game.winner] : null;
  const losingTeam = game.winner === 'A' ? game.teams.B : game.teams.A;
  const winningPlayers = game.players.filter(p => p.teamId === game.winner);

  if (!winningTeam) return null;

  return (
    <div className="min-h-screen felt-texture flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#D4A418', '#F4D03F', '#2D5016', '#FFF8E7']}
        />
      )}

      <div className="text-center animate-slide-up max-w-md w-full">
        {/* Trophy */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full gold-gradient mb-6 animate-float">
            <Trophy className="w-16 h-16 text-spade-black" />
          </div>
        </div>

        {/* Winner Announcement */}
        <h1 className="font-display text-4xl md:text-5xl font-bold gold-text mb-4">
          {winningTeam.name} Wins!
        </h1>

        <p className="text-xl text-foreground/80 mb-2">
          {winningPlayers.map(p => p.name).join(' & ')}
        </p>

        {/* Final Score */}
        <div className="team-card my-8">
          <div className="text-center">
            <p className="text-sm opacity-60 mb-2">Final Score</p>
            <div className="flex items-center justify-center gap-8">
              <div className={game.winner === 'A' ? 'text-gold' : 'opacity-50'}>
                <p className="font-display text-3xl font-bold">{game.teams.A.totalScore}</p>
                <p className="text-sm">{game.teams.A.name}</p>
              </div>
              <div className="text-2xl opacity-30">vs</div>
              <div className={game.winner === 'B' ? 'text-gold' : 'opacity-50'}>
                <p className="font-display text-3xl font-bold">{game.teams.B.totalScore}</p>
                <p className="text-sm">{game.teams.B.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-lg">{game.rounds.length}</p>
                <p className="opacity-60">Rounds</p>
              </div>
              <div>
                <p className="font-semibold text-lg">{game.teams.A.totalBags + game.teams.B.totalBags}</p>
                <p className="opacity-60">Total Bags</p>
              </div>
              <div>
                <p className="font-semibold text-lg">{Math.abs(winningTeam.totalScore - losingTeam.totalScore)}</p>
                <p className="opacity-60">Point Margin</p>
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
