import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen = ({ onStartGame }: TitleScreenProps) => {
  const { dispatch } = useGame();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSetGameMode = (mode: 'casual' | 'timed') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
    onStartGame();
  };

  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all border-4 border-blue-300">
      {/* Game title */}
      <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-10 text-center relative overflow-hidden">
        {/* Decorative clouds */}
        <div className="absolute top-2 left-4 text-white/30 text-6xl rotate-12">☁️</div>
        <div className="absolute top-8 right-6 text-white/30 text-5xl -rotate-12">☁️</div>
        <div className="absolute -bottom-4 left-1/4 text-white/20 text-7xl">☁️</div>

        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] mb-2 relative z-10 font-sans tracking-wide">
          Spell Steps
        </h1>
        <p className="text-blue-100 text-xl font-bold tracking-wider relative z-10 bg-black/20 inline-block px-4 py-1 rounded-full">
          Magic Words, Magic Steps! ✨
        </p>
      </div>

      {/* Game instructions or mode selection */}
      <div className="p-8 bg-sky-50">
        {showInstructions ? (
          <div className="mb-2 text-gray-700 bg-white p-6 rounded-2xl shadow-inner border-2 border-sky-100">
            <h2 className="text-3xl font-extrabold text-sky-600 mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 mr-3 text-yellow-500" />
              How to Play
            </h2>
            <ul className="space-y-4 text-lg font-medium">
              <li className="flex items-center bg-sky-50 p-3 rounded-xl">
                <span className="text-2xl mr-3">🔤</span>
                <span>Type magic words to build stones across the river!</span>
              </li>
              <li className="flex items-center bg-blue-50 p-3 rounded-xl">
                <span className="text-2xl mr-3">📏</span>
                <span>Longer words = BIGGER stones!</span>
              </li>
              <li className="flex items-center bg-indigo-50 p-3 rounded-xl">
                <span className="text-2xl mr-3">🌟</span>
                <span>Special long words make glowing stones & give bonus points!</span>
              </li>
              <li className="flex items-center bg-purple-50 p-3 rounded-xl">
                <span className="text-2xl mr-3">⏱️</span>
                <span>Timed Mode: Race the clock!</span>
              </li>
            </ul>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-md border-b-4 border-gray-400"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-sky-700 mb-6 text-center">
              CHOOSE YOUR ADVENTURE!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => handleSetGameMode('casual')}
                className="group relative bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_4px_0_rgb(21,128,61)] hover:translate-y-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 text-4xl group-hover:scale-125 transition-transform duration-300">🐢</div>
                <div className="font-extrabold text-2xl mb-1 shadow-black/20 drop-shadow-md">Casual Play</div>
                <div className="text-green-100 font-medium">Take your time, have fun!</div>
              </button>

              <button
                onClick={() => handleSetGameMode('timed')}
                className="group relative bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white p-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_0_rgb(88,28,135)] hover:shadow-[0_4px_0_rgb(88,28,135)] hover:translate-y-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 text-4xl group-hover:scale-125 transition-transform duration-300">⚡</div>
                <div className="font-extrabold text-2xl mb-1 shadow-black/20 drop-shadow-md">Time Sprint</div>
                <div className="text-purple-200 font-medium">Race against the clock!</div>
              </button>
            </div>

            <button
              onClick={() => setShowInstructions(true)}
              className="w-full py-4 bg-sky-200 hover:bg-sky-300 text-sky-800 text-xl font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_6px_0_rgb(125,211,252)]"
            >
              📖 How to Play
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;