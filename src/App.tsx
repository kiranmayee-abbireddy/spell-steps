import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import GameScreen from './components/GameScreen';
import TitleScreen from './components/TitleScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-sky-300 to-blue-500 flex items-center justify-center">
      <GameProvider>
        {!gameStarted ? (
          <div className="p-4 w-full h-full flex items-center justify-center max-w-2xl mx-auto">
            <TitleScreen onStartGame={() => setGameStarted(true)} />
          </div>
        ) : (
          <GameScreen />
        )}
      </GameProvider>
    </div>
  );
}

export default App;