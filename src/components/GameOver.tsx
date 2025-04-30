import React from 'react';
import { useGame } from '../context/GameContext';

const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { gameStatus, score, words } = state;
  
  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  const handleSwitchMode = () => {
    dispatch({ 
      type: 'SET_GAME_MODE', 
      payload: state.gameMode === 'casual' ? 'timed' : 'casual' 
    });
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className={`text-2xl font-bold mb-4 ${
        gameStatus === 'won' ? 'text-green-600' : 'text-red-600'
      }`}>
        {gameStatus === 'won' ? '🎉 You Win! 🎉' : '😢 Game Over 😢'}
      </h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        <div className="text-center mb-4">
          <p className="text-gray-600">{state.message}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-500">Final Score</div>
            <div className="text-xl font-bold text-blue-600">{score}</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-500">Words Used</div>
            <div className="text-xl font-bold text-blue-600">{words.length}</div>
          </div>
        </div>
        
        {/* Word list */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Your Words:</h3>
          <div className="max-h-40 overflow-y-auto bg-gray-50 rounded p-2">
            {words.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {words.map((word, index) => (
                  <div
                    key={`${word.word}-${index}`}
                    className={`px-2 py-1 text-xs rounded-full ${
                      word.special
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {word.word} <span className="text-gray-500">+{word.points}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-2">No words used</div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={handlePlayAgain}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Play Again
          </button>
          
          <button
            onClick={handleSwitchMode}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            Switch to {state.gameMode === 'casual' ? 'Timed' : 'Casual'} Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;