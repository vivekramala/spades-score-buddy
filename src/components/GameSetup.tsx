import { useState } from 'react';
import { SpadeIcon } from './SpadeIcon';
import { ChevronLeft, Users } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (playerNames: string[], targetScore: number) => void;
  onBack: () => void;
}

export const GameSetup = ({ onStartGame, onBack }: GameSetupProps) => {
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [targetScore, setTargetScore] = useState(500);

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = playerNames.map((name, i) => name.trim() || `Player ${i + 1}`);
    onStartGame(names, targetScore);
  };

  const isValid = true; // Allow empty names, they'll be defaulted

  return (
    <div className="min-h-screen felt-texture flex flex-col p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="btn-secondary p-3 rounded-full"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold gold-text">
            Game Setup
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter player names and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Teams Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Team A */}
          <div className="team-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                <SpadeIcon size="sm" className="text-spade-black" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Team A</h2>
                <p className="text-sm opacity-60">Partners</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Player 1
                </label>
                <input
                  type="text"
                  value={playerNames[0]}
                  onChange={(e) => handlePlayerNameChange(0, e.target.value)}
                  placeholder="Enter name"
                  className="input-field bg-white/50 text-spade-black placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Player 3
                </label>
                <input
                  type="text"
                  value={playerNames[2]}
                  onChange={(e) => handlePlayerNameChange(2, e.target.value)}
                  placeholder="Enter name"
                  className="input-field bg-white/50 text-spade-black placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="team-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Team B</h2>
                <p className="text-sm opacity-60">Partners</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Player 2
                </label>
                <input
                  type="text"
                  value={playerNames[1]}
                  onChange={(e) => handlePlayerNameChange(1, e.target.value)}
                  placeholder="Enter name"
                  className="input-field bg-white/50 text-spade-black placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Player 4
                </label>
                <input
                  type="text"
                  value={playerNames[3]}
                  onChange={(e) => handlePlayerNameChange(3, e.target.value)}
                  placeholder="Enter name"
                  className="input-field bg-white/50 text-spade-black placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Game Settings */}
        <div className="card-surface p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-display text-lg font-semibold text-gold mb-4">
            Game Settings
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Target Score
              </label>
              <div className="flex gap-2">
                {[300, 500, 750, 1000].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setTargetScore(score)}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      targetScore === score
                        ? 'gold-gradient text-spade-black glow-gold'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-auto">
          <button
            type="submit"
            disabled={!isValid}
            className="btn-primary w-full py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SpadeIcon size="sm" />
            Start Game
          </button>
        </div>
      </form>
    </div>
  );
};
