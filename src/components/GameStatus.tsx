import React from 'react';
import { useGame } from '../context/GameContext';
import { formatTime } from '../utils/gameUtils';

const GameStatus: React.FC = () => {
  const { state } = useGame();
  const { score, timeRemaining, gameMode, words } = state;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 shadow-md z-10">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500">Score</div>
          <div className="text-xl font-bold text-blue-600">{score}</div>
        </div>
        
        {gameMode === 'timed' && (
          <div className="flex flex-col justify-center items-center">
            <div className="text-sm font-medium text-gray-500">Time</div>
            <div className={`text-xl font-bold ${
              timeRemaining < 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'
            }`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        )}
        
        <div className="flex flex-col justify-center items-end">
          <div className="text-sm font-medium text-gray-500">Words</div>
          <div className="text-xl font-bold text-blue-600">{words.length}</div>
        </div>
      </div>
      
      {/* Recent words */}
      {words.length > 0 && (
        <div className="mt-2 overflow-hidden">
          <div className="text-xs font-medium text-gray-500 mb-1">Recent Words:</div>
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {words.slice(-5).reverse().map((word, index) => (
              <div
                key={`${word.word}-${index}`}
                className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                  word.special
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {word.word} <span className="text-gray-500">+{word.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;