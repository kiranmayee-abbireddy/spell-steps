import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen = ({ onStartGame }: TitleScreenProps) => {
  const { rootState, dispatch } = useGame();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSetGameMode = (mode: 'casual' | 'timed') => {
    dispatch({ type: 'SET_ACTIVE_MODE', payload: mode });
    dispatch({ type: 'RESET_GAME' });
    onStartGame();
  };

  const handleContinue = (mode: 'casual' | 'timed') => {
    dispatch({ type: 'SET_ACTIVE_MODE', payload: mode });
    onStartGame();
  };

  const casualState = rootState.casual;
  const timedState = rootState.timed;

  const hasCasualSave = casualState.score > 0 || casualState.level > 1 || casualState.gameStatus === 'playing' || casualState.gameStatus === 'won';
  const hasTimedSave = timedState.score > 0 || timedState.level > 1 || timedState.gameStatus === 'playing' || timedState.gameStatus === 'won';

  return (
    <div className="w-full max-w-2xl max-h-[95vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transform transition-all border-4 border-blue-300 flex flex-col">
      {/* Game title */}
      <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4 md:p-8 text-center relative overflow-hidden flex-shrink-0">
        {/* Decorative clouds */}
        <div className="absolute top-1 left-2 text-white/30 text-4xl rotate-12">☁️</div>
        <div className="absolute top-4 right-3 text-white/30 text-3xl -rotate-12">☁️</div>
        <div className="absolute -bottom-2 left-1/4 text-white/20 text-5xl">☁️</div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] mb-1 relative z-10 font-sans tracking-wide">
          Spell Steps
        </h1>
        <p className="text-blue-100 text-sm md:text-xl font-bold tracking-wider relative z-10 bg-black/20 inline-block px-3 py-0.5 md:px-4 md:py-1 rounded-full">
          Magic Words, Magic Steps! ✨
        </p>

        {rootState[rootState.activeMode].highScore > 0 && (
          <div className="absolute top-2 right-2 z-20 bg-yellow-400 border-b-4 border-yellow-600 px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-lg transform rotate-3">
            <div className="hidden md:inline-block text-[8px] font-black text-yellow-900 uppercase tracking-widest bg-white/40 rounded-full px-2 py-0.5 mb-1">High Score</div>
            <div className="text-sm md:text-2xl font-black text-white drop-shadow-md flex items-center">
              <span className="mr-1">🏆</span> {rootState[rootState.activeMode].highScore}
            </div>
          </div>
        )}
      </div>

      {/* Game instructions or mode selection */}
      <div className="p-4 md:p-8 bg-sky-50 overflow-y-auto scrollbar-hide">
        {showInstructions ? (
          <div className="mb-2 text-gray-700 bg-white p-4 md:p-6 rounded-2xl shadow-inner border-2 border-sky-100">
            <h2 className="text-2xl md:text-3xl font-extrabold text-sky-600 mb-2 md:mb-4 flex items-center justify-center">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-yellow-500" />
              How to Play
            </h2>
            <ul className="space-y-2 md:space-y-4 text-sm md:text-lg font-medium">
              <li className="flex items-center bg-sky-50 p-2 md:p-3 rounded-xl border-l-4 border-sky-400">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">🔤</span>
                <span>Type magic words to build stones across the river!</span>
              </li>
              <li className="flex items-center bg-blue-50 p-2 md:p-3 rounded-xl border-l-4 border-blue-400">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">📏</span>
                <span>Longer words make <b>MASSIVE</b> oval stones that bridge more distance!</span>
              </li>
              <li className="flex items-center bg-yellow-50 p-2 md:p-3 rounded-xl border-l-4 border-yellow-400">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">💡</span>
                <span><b>Click a stone</b> to reveal its meaning, synonyms, and antonyms!</span>
              </li>
              <li className="flex items-center bg-purple-50 p-2 md:p-3 rounded-xl border-l-4 border-purple-400">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">🎭</span>
                <span>Reach <b>Level 5, 10, 15...</b> to unlock rare magical character skins!</span>
              </li>
              <li className="flex items-center bg-emerald-50 p-2 md:p-3 rounded-xl border-l-4 border-emerald-400">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">🌊</span>
                <span>Watch out! The river gets <b>physically wider</b> as you level up!</span>
              </li>
            </ul>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-4 md:mt-8 py-3 md:py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg md:text-xl font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-md border-b-4 border-gray-400"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-extrabold text-sky-700 mb-4 md:mb-6 text-center">
              CHOOSE YOUR ADVENTURE!
            </h2>

            <div className="space-y-4 mb-4 md:mb-6">
              {hasCasualSave && (
                <button
                  onClick={() => handleContinue('casual')}
                  className="w-full group relative bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white p-4 md:p-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_8px_0_rgb(37,99,235)] hover:shadow-[0_4px_0_rgb(37,99,235)] hover:translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-2 md:p-4 opacity-50 text-2xl md:text-4xl group-hover:scale-125 transition-transform duration-300">🗺️</div>
                  <div className="font-extrabold text-xl md:text-2xl mb-1 shadow-black/20 drop-shadow-md text-left">Continue Casual</div>
                  <div className="text-blue-100 text-xs md:text-sm font-medium text-left">Level {casualState.level} • Score {casualState.score}</div>
                </button>
              )}

              {hasTimedSave && (
                <button
                  onClick={() => handleContinue('timed')}
                  className="w-full group relative bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white p-4 md:p-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_8px_0_rgb(67,56,202)] hover:shadow-[0_4px_0_rgb(67,56,202)] hover:translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-2 md:p-4 opacity-50 text-2xl md:text-4xl group-hover:scale-125 transition-transform duration-300">⏳</div>
                  <div className="font-extrabold text-xl md:text-2xl mb-1 shadow-black/20 drop-shadow-md text-left">Continue Time Sprint</div>
                  <div className="text-indigo-200 text-xs md:text-sm font-medium text-left">Level {timedState.level} • Score {timedState.score}</div>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
              <button
                onClick={() => handleSetGameMode('casual')}
                className="group relative bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-4 md:p-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_4px_0_rgb(21,128,61)] hover:translate-y-1"
              >
                <div className="absolute top-0 right-0 p-2 md:p-4 opacity-50 text-2xl md:text-4xl group-hover:scale-125 transition-transform duration-300">🐢</div>
                <div className="font-extrabold text-lg md:text-2xl mb-1 shadow-black/20 drop-shadow-md">New Casual</div>
                <div className="text-green-100 text-xs md:text-sm font-medium">Take your time, have fun!</div>
              </button>

              <button
                onClick={() => handleSetGameMode('timed')}
                className="group relative bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white p-4 md:p-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_0_rgb(88,28,135)] hover:shadow-[0_4px_0_rgb(88,28,135)] hover:translate-y-1"
              >
                <div className="absolute top-0 right-0 p-2 md:p-4 opacity-50 text-2xl md:text-4xl group-hover:scale-125 transition-transform duration-300">⚡</div>
                <div className="font-extrabold text-lg md:text-2xl mb-1 shadow-black/20 drop-shadow-md">New Time Sprint</div>
                <div className="text-purple-200 text-xs md:text-sm font-medium">Race against the clock!</div>
              </button>
            </div>

            <button
              onClick={() => setShowInstructions(true)}
              className="w-full py-3 md:py-4 bg-sky-200 hover:bg-sky-300 text-sky-800 text-lg md:text-xl font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_6px_0_rgb(125,211,252)]"
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