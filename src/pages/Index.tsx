import { useGame } from '@/hooks/useGame';
import { HomeScreen } from '@/components/HomeScreen';
import { GameSetup } from '@/components/GameSetup';
import { GameScreen } from '@/components/GameScreen';
import { WinnerScreen } from '@/components/WinnerScreen';

const Index = () => {
  const {
    gameState,
    startNewGame,
    submitBid,
    submitTricks,
    undoLastRound,
    resetGame,
    goToSetup,
    validateBid,
  } = useGame();

  const handleStartNewGame = (playerNames: string[], firstDistributor: number) => {
    startNewGame(playerNames, firstDistributor);
  };

  switch (gameState.currentStep) {
    case 'home':
      return <HomeScreen onStartGame={goToSetup} />;

    case 'setup':
      return <GameSetup onStartGame={handleStartNewGame} onBack={resetGame} />;

    case 'playing':
      if (!gameState.game || !gameState.roundState) return null;
      return (
        <GameScreen
          game={gameState.game}
          roundState={gameState.roundState}
          onSubmitBid={submitBid}
          onSubmitTricks={submitTricks}
          onUndo={undoLastRound}
          onEndGame={resetGame}
          validateBid={validateBid}
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
