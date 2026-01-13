import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';

interface ScoreEntryProps {
  teamAName: string;
  teamBName: string;
  roundNumber: number;
  onSubmit: (teamABid: number, teamATricks: number, teamBBid: number, teamBTricks: number) => void;
  onCancel: () => void;
}

export const ScoreEntry = ({
  teamAName,
  teamBName,
  roundNumber,
  onSubmit,
  onCancel,
}: ScoreEntryProps) => {
  const [teamABid, setTeamABid] = useState(0);
  const [teamATricks, setTeamATricks] = useState(0);
  const [teamBBid, setTeamBBid] = useState(0);
  const [teamBTricks, setTeamBTricks] = useState(0);

  const handleSubmit = () => {
    onSubmit(teamABid, teamATricks, teamBBid, teamBTricks);
  };

  // Validate that total tricks equal 13
  const totalTricks = teamATricks + teamBTricks;
  const isValidTricks = totalTricks === 13;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="card-surface p-6 w-full max-w-lg animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold gold-text">Round {roundNumber}</h2>
          <p className="text-muted-foreground text-sm">Enter bids and tricks won</p>
        </div>

        <div className="space-y-6">
          {/* Team A */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <h3 className="font-display text-lg font-semibold text-gold mb-4">{teamAName}</h3>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Bid"
                value={teamABid}
                onChange={setTeamABid}
                min={0}
                max={13}
              />
              <NumberInput
                label="Tricks Won"
                value={teamATricks}
                onChange={setTeamATricks}
                min={0}
                max={13}
              />
            </div>
          </div>

          {/* Team B */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">{teamBName}</h3>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Bid"
                value={teamBBid}
                onChange={setTeamBBid}
                min={0}
                max={13}
              />
              <NumberInput
                label="Tricks Won"
                value={teamBTricks}
                onChange={setTeamBTricks}
                min={0}
                max={13}
              />
            </div>
          </div>

          {/* Validation message */}
          {!isValidTricks && totalTricks > 0 && (
            <p className="text-center text-warning text-sm">
              Total tricks must equal 13 (currently {totalTricks})
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValidTricks}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const NumberInput = ({ label, value, onChange, min, max }: NumberInputProps) => {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center transition-colors hover:bg-secondary"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 h-10 rounded-lg bg-card border border-border flex items-center justify-center font-bold text-lg">
          {value}
        </div>
        <button
          type="button"
          onClick={increment}
          className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center transition-colors hover:bg-secondary"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
