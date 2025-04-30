import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import RiverBackground from './RiverBackground';
import WordInput from './WordInput';
import SteppingStones from './SteppingStones';
import Character from './Character';
import GameStatus from './GameStatus';
import GameOver from './GameOver';
import { playSound } from '../utils/soundUtils';

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start game logic
  useEffect(() => {
    if (state.gameStatus === 'ready') {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'playing' });
      // Play background sound
      playSound('background');
    }
  }, [dispatch, state.gameStatus]);

  // Timer logic for timed mode
  useEffect(() => {
    if (state.gameStatus === 'playing' && state.gameMode === 'timed') {
      timerRef.current = setInterval(() => {
        if (state.timeRemaining <= 0) {
          // Game over - ran out of time
          clearInterval(timerRef.current!);
          dispatch({ type: 'SET_GAME_STATUS', payload: 'lost' });
          dispatch({ type: 'SET_MESSAGE', payload: 'Out of time! Try again.' });
          playSound('fail');
        } else {
          dispatch({ type: 'UPDATE_TIME', payload: state.timeRemaining - 1 });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.gameStatus, state.timeRemaining, state.gameMode, dispatch]);

  // Check win condition
  useEffect(() => {
    if (
      state.gameStatus === 'playing' &&
      state.currentPosition >= state.targetPosition
    ) {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'won' });
      dispatch({ 
        type: 'SET_MESSAGE', 
        payload: 'You made it across! Great job!' 
      });
      playSound('win');
    }
  }, [state.currentPosition, state.gameStatus, state.targetPosition, dispatch]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <RiverBackground />
      
      <div className="absolute inset-0 flex flex-col justify-between">
        {/* Game status bar */}
        <GameStatus />
        
        {/* Game area */}
        <div className="flex-grow relative">
          <SteppingStones />
          <Character />
        </div>
        
        {/* Word input area */}
        <div className="p-4 bg-white/80 backdrop-blur-sm">
          {state.gameStatus === 'playing' ? (
            <WordInput />
          ) : (
            <GameOver />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;