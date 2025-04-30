import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { playSound } from '../utils/soundUtils';

const Character: React.FC = () => {
  const { state } = useGame();
  const { character, currentPosition, targetPosition, gameStatus } = state;
  const characterRef = useRef<HTMLDivElement>(null);
  
  // Animation timing based on character's walk speed
  const animationDuration = Math.max(0.5, 2 - character.walkSpeed * 0.5);
  
  // Calculate position as percentage of total distance, capped at 95%
  const positionPercent = Math.min(95, (currentPosition / targetPosition) * 90);
  
  // Character animation effect
  useEffect(() => {
    if (characterRef.current && currentPosition > 0) {
      // Play step sound when character moves
      playSound('step');
      
      // Add walking animation class
      characterRef.current.classList.add('walking');
      
      // Remove animation class after movement is complete
      const timer = setTimeout(() => {
        if (characterRef.current) {
          characterRef.current.classList.remove('walking');
        }
      }, animationDuration * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPosition, animationDuration]);

  return (
    <div
      ref={characterRef}
      className={`absolute bottom-[25%] transition-all duration-${Math.round(
        animationDuration * 1000
      )} ease-in-out transform-gpu ${
        gameStatus === 'playing' ? 'bounce' : ''
      }`}
      style={{
        left: `${positionPercent}%`,
        transition: `left ${animationDuration}s ease-in-out`,
      }}
    >
      <div className="relative">
        {/* Character sprite */}
        <div className="text-4xl md:text-5xl">
          {character.sprite}
        </div>
        
        {/* Character name */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700 bg-white/70 px-2 py-0.5 rounded-full">
          {character.name}
        </div>
      </div>
    </div>
  );
};

export default Character;