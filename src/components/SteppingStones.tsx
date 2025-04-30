import React from 'react';
import { useGame } from '../context/GameContext';

const SteppingStones: React.FC = () => {
  const { state } = useGame();
  const { stones, targetPosition } = state;

  return (
    <div className="absolute bottom-[10%] w-full h-16 pointer-events-none">
      {/* Starting bank */}
      <div className="absolute bottom-0 left-0 w-[5%] h-24 bg-green-800 rounded-tr-lg"></div>
      
      {/* Ending bank */}
      <div className="absolute bottom-0 right-0 w-[5%] h-24 bg-green-800 rounded-tl-lg"></div>
      
      {/* Render stepping stones */}
      {stones.map((stone) => {
        // Calculate position percentage
        const position = (stone.position / targetPosition) * 100;
        
        // Calculate stone size based on word quality
        const width = `${Math.max(4, Math.min(8, stone.size))}%`;
        
        return (
          <div
            key={stone.id}
            className={`absolute bottom-0 transform-gpu transition-transform duration-500 ease-bounce
              ${stone.special ? 'animate-pulse-subtle' : ''}
            `}
            style={{
              left: `${position}%`,
              width,
              height: '30px',
              backgroundColor: stone.special ? '#f59e0b' : '#78716c',
              borderRadius: '50%',
              boxShadow: stone.special 
                ? '0 0 12px 2px rgba(245, 158, 11, 0.6)' 
                : '0 2px 4px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              animation: 'bounce-in 0.5s ease-out',
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-medium bg-white/70 px-1.5 py-0.5 rounded whitespace-nowrap overflow-hidden max-w-[100px] text-ellipsis">
              {stone.word}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SteppingStones;