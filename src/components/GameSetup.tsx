import { useState } from 'react';
import { SpadeIcon } from './SpadeIcon';
import { ChevronLeft, Users } from 'lucide-react';
import { StartGameModal } from './StartGameModal';

interface GameSetupProps {
  onStartGame: (playerNames: string[], firstDistributor: number) => void;
  onBack: () => void;
}

export const GameSetup = ({ onStartGame, onBack }: GameSetupProps) => {
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [showStartModal, setShowStartModal] = useState(false);

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowStartModal(true);
  };

  const handleConfirmStart = (firstDistributor: number) => {
    const names = playerNames.map((name, i) => name.trim() || `Player ${i + 1}`);
    onStartGame(names, firstDistributor);
  };

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
            Enter player names (clockwise seating order)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Players Section */}
        <div className="card-surface p-6 mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <Users className="w-5 h-5 text-spade-black" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Players</h2>
              <p className="text-sm text-muted-foreground">
                Enter names in clockwise seating order
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Player {index + 1}
                </label>
                <input
                  type="text"
                  value={playerNames[index]}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="card-surface p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-display text-lg font-semibold text-gold mb-4">
            Game Rules
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <SpadeIcon size="sm" className="text-gold mt-0.5 flex-shrink-0" />
              <span>13 rounds with increasing cards (Round 1 = 1 card, Round 13 = 13 cards)</span>
            </li>
            <li className="flex items-start gap-2">
              <SpadeIcon size="sm" className="text-gold mt-0.5 flex-shrink-0" />
              <span>Distributor rotates clockwise each round</span>
            </li>
            <li className="flex items-start gap-2">
              <SpadeIcon size="sm" className="text-gold mt-0.5 flex-shrink-0" />
              <span>Total bids cannot equal the round number</span>
            </li>
            <li className="flex items-start gap-2">
              <SpadeIcon size="sm" className="text-gold mt-0.5 flex-shrink-0" />
              <span>Highest total score after 13 rounds wins</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="mt-auto">
          <button
            type="submit"
            className="btn-primary w-full py-4 text-lg rounded-xl"
          >
            <SpadeIcon size="sm" />
            Start Game
          </button>
        </div>
      </form>

      <StartGameModal
        open={showStartModal}
        onConfirm={handleConfirmStart}
        onCancel={() => setShowStartModal(false)}
        playerNames={playerNames.map((name, i) => name.trim() || `Player ${i + 1}`)}
      />
    </div>
  );
};
