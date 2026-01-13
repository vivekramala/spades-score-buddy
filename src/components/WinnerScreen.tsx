import { Game } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { Trophy, RotateCcw, Home, Medal } from 'lucide-react';
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

  // Sort players by final score
  const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

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
          {winner.name} Wins!
        </h1>

        <p className="text-xl text-foreground/80 mb-2">
          {winner.totalScore} points
        </p>

        {/* Final Standings */}
        <div className="team-card my-8">
          <h2 className="font-display text-lg font-semibold text-gold mb-4 flex items-center justify-center gap-2">
            <Medal className="w-5 h-5" />
            Final Standings
          </h2>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-gold/10 border border-gold/30' : 'bg-secondary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'gold-gradient text-spade-black' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`font-medium ${index === 0 ? 'text-gold' : ''}`}>
                    {player.name}
                  </span>
                </div>
                <span className={`font-display text-xl font-bold ${
                  player.totalScore < 0 ? 'text-destructive' : index === 0 ? 'text-gold' : ''
                }`}>
                  {player.totalScore}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-lg">{game.rounds.length}</p>
                <p className="opacity-60">Rounds Played</p>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {sortedPlayers[0].totalScore - sortedPlayers[1].totalScore}
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
