import { useGame } from '@/hooks/useGame';
import { HomeScreen } from '@/components/HomeScreen';
import { GameSetup } from '@/components/GameSetup';
import { GameScreen } from '@/components/GameScreen';
import { WinnerScreen } from '@/components/WinnerScreen';

const Index = () => {
  const { gameState, startNewGame, addRound, undoLastRound, resetGame, goToSetup } = useGame();

  const handleStartNewGame = (playerNames: string[], targetScore: number) => {
    startNewGame(playerNames, targetScore);
  };

  switch (gameState.currentStep) {
    case 'home':
      return <HomeScreen onStartGame={goToSetup} />;

    case 'setup':
      return <GameSetup onStartGame={handleStartNewGame} onBack={resetGame} />;

    case 'playing':
      if (!gameState.game) return null;
      return (
        <GameScreen
          game={gameState.game}
          onAddRound={addRound}
          onUndo={undoLastRound}
          onEndGame={resetGame}
        />
      );

    case 'complete':
      if (!gameState.game) return null;
      return (
        <WinnerScreen
          game={gameState.game}
          onNewGame={goToSetup}
          onHome={resetGame}
        />
      );

    default:
      return <HomeScreen onStartGame={goToSetup} />;
  }
};

export default Index;
