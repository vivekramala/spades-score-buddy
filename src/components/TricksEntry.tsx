import { useState } from 'react';
import { Player } from '@/types/game';
import { Minus, Plus, Check, AlertCircle } from 'lucide-react';

interface TricksEntryProps {
  players: Player[];
  bids: Map<string, number>;
  roundNumber: number;
  onSubmitTricks: (tricks: Map<string, number>) => void;
}

export const TricksEntry = ({
  players,
  bids,
  roundNumber,
  onSubmitTricks,
}: TricksEntryProps) => {
  const [tricks, setTricks] = useState<Map<string, number>>(
    new Map(players.map(p => [p.id, 0]))
  );

  const totalTricks = Array.from(tricks.values()).reduce((sum, t) => sum + t, 0);
  const isValid = totalTricks === roundNumber;

  const handleTricksChange = (playerId: string, delta: number) => {
    setTricks(prev => {
      const newTricks = new Map(prev);
      const current = newTricks.get(playerId) || 0;
      const newValue = Math.max(0, Math.min(roundNumber, current + delta));
      newTricks.set(playerId, newValue);
      return newTricks;
    });
  };

  const setPlayerTricks = (playerId: string, value: number) => {
    setTricks(prev => {
      const newTricks = new Map(prev);
      newTricks.set(playerId, Math.max(0, Math.min(roundNumber, value)));
      return newTricks;
    });
  };

  const handleSubmit = () => {
    if (isValid) {
      onSubmitTricks(tricks);
    }
  };

  return (
    <div className="card-surface p-6 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="font-display text-xl font-bold text-gold">Enter Tricks Won</h2>
        <p className={`text-sm mt-1 ${isValid ? 'text-success' : 'text-muted-foreground'}`}>
          Total: {totalTricks} / {roundNumber} tricks
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {players.map((player) => {
          const bid = bids.get(player.id) || 0;
          const playerTricks = tricks.get(player.id) || 0;
          const diff = playerTricks - bid;
          
          return (
            <div key={player.id} className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{player.name}</h3>
                  <p className="text-xs text-muted-foreground">Bid: {bid}</p>
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded ${
                  diff > 0 ? 'bg-warning/20 text-warning' :
                  diff < 0 ? 'bg-destructive/20 text-destructive' :
                  playerTricks === bid ? 'bg-success/20 text-success' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {diff > 0 ? `+${diff} over` : diff < 0 ? `${diff} under` : 'On bid'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTricksChange(player.id, -1)}
                  className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center transition-colors hover:bg-secondary active:scale-95"
                  disabled={playerTricks <= 0}
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex-1 flex gap-1 justify-center flex-wrap">
                  {Array.from({ length: Math.min(roundNumber + 1, 6) }, (_, i) => i).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPlayerTricks(player.id, n)}
                      className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                        playerTricks === n
                          ? 'gold-gradient text-spade-black'
                          : 'bg-card border border-border hover:bg-secondary'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  {roundNumber >= 6 && (
                    <input
                      type="number"
                      min={0}
                      max={roundNumber}
                      value={playerTricks}
                      onChange={(e) => setPlayerTricks(player.id, parseInt(e.target.value) || 0)}
                      className="w-14 h-9 rounded-lg bg-card border border-border text-center font-semibold text-sm"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTricksChange(player.id, 1)}
                  className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center transition-colors hover:bg-secondary active:scale-95"
                  disabled={playerTricks >= roundNumber}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation message */}
      {!isValid && totalTricks > 0 && (
        <p className="text-center text-warning text-sm mb-4 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Total tricks must equal {roundNumber} (currently {totalTricks})
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="btn-primary w-full py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-5 h-5" />
        Submit Round
      </button>
    </div>
  );
};
