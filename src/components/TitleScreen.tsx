import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const { state, dispatch } = useGame();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSetGameMode = (mode: 'casual' | 'timed') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
    onStartGame();
  };

  return (
    <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transform transition-all">
      {/* Game title */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-1">Spell Steps</h1>
        <p className="text-blue-100 italic">One word at a time, one step at a time.</p>
        <p className="text-white/70 text-xs mt-2">By Kiryee</p>
      </div>

      {/* Game instructions or mode selection */}
      <div className="p-6">
        {showInstructions ? (
          <div className="mb-6 text-gray-600">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              How to Play
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Type valid English words to create stepping stones across the river</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Longer words create bigger stones, helping you cross faster</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Special words (6+ letters) create glowing stones and give bonus points</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>In timed mode, you must reach the other side before time runs out</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>In casual mode, take as long as you need to cross the river</span>
              </li>
            </ul>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-medium rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Choose Your Game Mode
            </h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <button
                onClick={() => handleSetGameMode('casual')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-6 rounded-lg transition-colors text-center"
              >
                <div className="font-bold text-lg">Casual Mode</div>
                <div className="text-sm text-blue-600">Take your time, no pressure</div>
              </button>
              
              <button
                onClick={() => handleSetGameMode('timed')}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-6 rounded-lg transition-colors text-center"
              >
                <div className="font-bold text-lg">Timed Challenge</div>
                <div className="text-sm text-purple-600">Race against the clock!</div>
              </button>
            </div>
            
            <button
              onClick={() => setShowInstructions(true)}
              className="w-full py-2 text-gray-600 hover:text-gray-700 font-medium rounded-lg transition-colors"
            >
              How to Play
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;