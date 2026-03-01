import { useGame } from '../context/GameContext';
import { formatTime } from '../utils/gameUtils';

import { Star } from 'lucide-react';

const GameStatus = () => {
  const { state } = useGame();
  const { score, timeRemaining, gameMode, words, level, stars } = state;

  return (
    <div className="absolute top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-10 pointer-events-none">
      <div className="flex flex-wrap justify-between items-start gap-2">
        {/* Score Badge */}
        <div className="flex space-x-2">
          {/* Level Badge */}
          <div className="bg-emerald-400 border-4 border-emerald-500 rounded-xl md:rounded-2xl p-1 md:p-2 px-2 md:px-4 shadow-[0_4px_0_rgb(16,185,129)] flex items-center transform -rotate-1 pointer-events-auto">
            <div className="flex flex-col items-center">
              <span className="text-emerald-900 text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">Level</span>
              <span className="text-white text-xl md:text-3xl font-black drop-shadow-md leading-none">{level}</span>
            </div>
          </div>

          {/* Score Badge */}
          <div className="bg-yellow-400 border-4 border-yellow-500 rounded-xl md:rounded-2xl p-1 md:p-2 px-2 md:px-4 shadow-[0_4px_0_rgb(202,138,4)] flex items-center transform -rotate-2 pointer-events-auto">
            <div className="flex flex-col items-center">
              <span className="text-yellow-800 text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">Score</span>
              <span className="text-white text-xl md:text-3xl font-black drop-shadow-md leading-none">{score}</span>
            </div>
          </div>

          {/* Stars Badge */}
          <div className="bg-amber-400 border-4 border-amber-500 rounded-xl md:rounded-2xl p-1 md:p-2 px-2 md:px-4 shadow-[0_4px_0_rgb(217,119,6)] flex items-center transform rotate-1 pointer-events-auto">
            <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-100 fill-current mr-1 md:mr-2 drop-shadow-md" />
            <div className="flex flex-col items-center">
              <span className="text-amber-900 text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">Stars</span>
              <span className="text-white text-xl md:text-3xl font-black drop-shadow-md leading-none">{stars}</span>
            </div>
          </div>
        </div>

        {/* Time Badge (if timed) */}
        {gameMode === 'timed' && (
          <div className={`bg-white border-4 rounded-xl md:rounded-2xl p-1 md:p-2 px-3 md:px-6 shadow-[0_4px_0_rgb(209,213,219)] pointer-events-auto flex flex-col items-center
            ${timeRemaining < 10 ? 'border-red-500 animate-pulse scale-105 md:scale-110 text-red-500' : 'border-gray-200 text-sky-500'}
          `}>
            <span className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">Time Left</span>
            <span className="text-xl md:text-3xl font-black">{formatTime(timeRemaining)}</span>
          </div>
        )}

        {/* Words Badge */}
        <div className="bg-sky-400 border-4 border-sky-500 rounded-xl md:rounded-2xl p-1 md:p-2 px-2 md:px-4 shadow-[0_4px_0_rgb(2,132,199)] flex flex-col items-center transform rotate-2 pointer-events-auto">
          <span className="text-sky-800 text-[10px] md:text-xs font-black uppercase tracking-wider leading-none">Words</span>
          <span className="text-white text-xl md:text-3xl font-black drop-shadow-md leading-none">{words.length}</span>
        </div>
      </div>

      {/* Recent words floating */}
      {words.length > 0 && (
        <div className="mt-2 md:mt-4 flex flex-col items-center justify-center pointer-events-none hidden md:flex">
          <div className="flex space-x-2 md:space-x-3 overflow-visible px-2 pb-2">
            {words.slice(-4).reverse().map((word, index) => (
              <div
                key={`${word.word}-${index}`}
                className={`px-2 py-1 md:px-4 md:py-2 font-black text-[10px] md:text-sm rounded-lg md:rounded-xl border-b-2 md:border-b-4 shadow-sm transform transition-all translate-y-0
                  ${index === 0 ? 'scale-105 md:scale-110 -translate-y-1' : 'opacity-80 scale-90 md:scale-90'}
                  ${word.special
                    ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border-amber-600'
                    : 'bg-white text-sky-600 border-gray-300'
                  }`}
              >
                {word.word} <span className="opacity-70 ml-1">+{word.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
