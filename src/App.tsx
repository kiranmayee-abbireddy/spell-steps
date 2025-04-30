import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import GameScreen from './components/GameScreen';
import TitleScreen from './components/TitleScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-blue-500 flex items-center justify-center">
      <GameProvider>
        {!gameStarted ? (
          <TitleScreen onStartGame={() => setGameStarted(true)} />
        ) : (
          <GameScreen />
        )}
      </GameProvider>
    </div>
  );
}

export default App;