import { SpadeIcon } from './SpadeIcon';

interface HomeScreenProps {
  onStartGame: () => void;
}

export const HomeScreen = ({ onStartGame }: HomeScreenProps) => {
  return (
    <div className="min-h-screen felt-texture flex flex-col items-center justify-center p-6">
      <div className="text-center animate-slide-up">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full gold-gradient mb-6 animate-float">
            <SpadeIcon size="xl" className="text-spade-black" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold gold-text mb-3">
            Spades
          </h1>
          <p className="font-display text-2xl md:text-3xl text-foreground/80">
            Score Tracker
          </p>
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
          Track your Spades games with ease. No more paper, no more math errors.
        </p>

        {/* Start Button */}
        <button
          onClick={onStartGame}
          className="btn-primary text-lg px-10 py-4 rounded-xl animate-pulse-gold"
        >
          <SpadeIcon size="sm" />
          New Game
        </button>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <FeatureCard
            icon="🎯"
            title="Auto Scoring"
            description="Bids, tricks, bags — all calculated instantly"
          />
          <FeatureCard
            icon="📊"
            title="Live Tracking"
            description="Watch scores update in real-time"
          />
          <FeatureCard
            icon="🏆"
            title="Winner Detection"
            description="Automatic game end when target is reached"
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="card-surface p-5 text-center transition-transform duration-300 hover:scale-105">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-gold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
