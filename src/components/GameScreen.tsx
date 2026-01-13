import { useState } from 'react';
import { Game } from '@/types/game';
import { SpadeIcon } from './SpadeIcon';
import { ScoreEntry } from './ScoreEntry';
import { Plus, RotateCcw, Home, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface GameScreenProps {
  game: Game;
  onAddRound: (teamABid: number, teamATricks: number, teamBBid: number, teamBTricks: number) => void;
  onUndo: () => void;
  onEndGame: () => void;
}

export const GameScreen = ({ game, onAddRound, onUndo, onEndGame }: GameScreenProps) => {
  const [showScoreEntry, setShowScoreEntry] = useState(false);

  const teamA = game.teams.A;
  const teamB = game.teams.B;

  const handleScoreSubmit = (teamABid: number, teamATricks: number, teamBBid: number, teamBTricks: number) => {
    onAddRound(teamABid, teamATricks, teamBBid, teamBTricks);
    setShowScoreEntry(false);
  };

  const teamABagPenalties = Math.floor(teamA.totalBags / game.bagPenaltyThreshold);
  const teamBBagPenalties = Math.floor(teamB.totalBags / game.bagPenaltyThreshold);

  return (
    <div className="min-h-screen felt-texture flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <SpadeIcon size="sm" className="text-spade-black" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gold-text">Spades</h1>
              <p className="text-xs text-muted-foreground">
                Target: {game.targetScore} pts
              </p>
            </div>
          </div>
          <button
            onClick={onEndGame}
            className="btn-secondary p-2 rounded-lg"
            aria-label="End game"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Score Cards */}
      <div className="p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
          <TeamScoreCard
            team={teamA}
            players={game.players.filter(p => p.teamId === 'A')}
            targetScore={game.targetScore}
            bagPenalties={teamABagPenalties}
            isLeading={teamA.totalScore > teamB.totalScore}
          />
          <TeamScoreCard
            team={teamB}
            players={game.players.filter(p => p.teamId === 'B')}
            targetScore={game.targetScore}
            bagPenalties={teamBBagPenalties}
            isLeading={teamB.totalScore > teamA.totalScore}
          />
        </div>
      </div>

      {/* Rounds History */}
      <div className="flex-1 p-4 md:p-6 pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-gold">
              Round History
            </h2>
            {game.rounds.length > 0 && (
              <button
                onClick={onUndo}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Undo Last
              </button>
            )}
          </div>

          {game.rounds.length === 0 ? (
            <div className="card-surface p-8 text-center">
              <p className="text-muted-foreground">
                No rounds yet. Tap the button below to add your first round.
              </p>
            </div>
          ) : (
            <div className="card-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">
                        Round
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gold" colSpan={2}>
                        {teamA.name}
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-foreground" colSpan={2}>
                        {teamB.name}
                      </th>
                    </tr>
                    <tr className="border-b border-border/50 text-xs text-muted-foreground">
                      <th></th>
                      <th className="py-2 px-2">Bid/Tricks</th>
                      <th className="py-2 px-2">Score</th>
                      <th className="py-2 px-2">Bid/Tricks</th>
                      <th className="py-2 px-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {game.rounds.map((round) => (
                      <tr key={round.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{round.roundNumber}</td>
                        <td className="py-3 px-2 text-center text-sm">
                          {round.teamABid}/{round.teamATricks}
                          {round.teamABags > 0 && (
                            <span className="text-warning ml-1">(+{round.teamABags})</span>
                          )}
                        </td>
                        <td className={`py-3 px-2 text-center font-semibold ${
                          round.teamAScore >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {round.teamAScore > 0 ? '+' : ''}{round.teamAScore}
                        </td>
                        <td className="py-3 px-2 text-center text-sm">
                          {round.teamBBid}/{round.teamBTricks}
                          {round.teamBBags > 0 && (
                            <span className="text-warning ml-1">(+{round.teamBBags})</span>
                          )}
                        </td>
                        <td className={`py-3 px-2 text-center font-semibold ${
                          round.teamBScore >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {round.teamBScore > 0 ? '+' : ''}{round.teamBScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Round Button */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowScoreEntry(true)}
            className="btn-primary w-full py-4 text-lg rounded-xl"
          >
            <Plus className="w-5 h-5" />
            Add Round {game.rounds.length + 1}
          </button>
        </div>
      </div>

      {/* Score Entry Modal */}
      {showScoreEntry && (
        <ScoreEntry
          teamAName={teamA.name}
          teamBName={teamB.name}
          roundNumber={game.rounds.length + 1}
          onSubmit={handleScoreSubmit}
          onCancel={() => setShowScoreEntry(false)}
        />
      )}
    </div>
  );
};

interface TeamScoreCardProps {
  team: Game['teams']['A'];
  players: Game['players'];
  targetScore: number;
  bagPenalties: number;
  isLeading: boolean;
}

const TeamScoreCard = ({ team, players, targetScore, bagPenalties, isLeading }: TeamScoreCardProps) => {
  const progress = Math.min((team.totalScore / targetScore) * 100, 100);
  const isNegative = team.totalScore < 0;

  return (
    <div className={`team-card relative overflow-hidden ${isLeading ? 'ring-2 ring-gold' : ''}`}>
      {isLeading && (
        <div className="absolute top-3 right-3">
          <TrendingUp className="w-5 h-5 text-gold" />
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full ${team.id === 'A' ? 'gold-gradient' : 'bg-gray-600'} flex items-center justify-center`}>
          <SpadeIcon size="sm" className={team.id === 'A' ? 'text-spade-black' : 'text-white'} />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">{team.name}</h3>
          <p className="text-xs opacity-60">
            {players.map(p => p.name).join(' & ')}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className={`font-display text-4xl font-bold ${isNegative ? 'text-red-600' : ''}`}>
          {team.totalScore}
          <span className="text-sm font-normal opacity-50 ml-2">/ {targetScore}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-500 ${isNegative ? 'bg-red-500' : 'gold-gradient'}`}
          style={{ width: `${Math.max(0, progress)}%` }}
        />
      </div>

      {/* Bags indicator */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <span className="opacity-60">Bags:</span>
          <span className={`font-semibold ${team.totalBags >= 8 ? 'text-orange-500' : ''}`}>
            {team.totalBags % 10}/10
          </span>
        </div>
        {bagPenalties > 0 && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">-{bagPenalties * 100} penalty</span>
          </div>
        )}
      </div>
    </div>
  );
};
