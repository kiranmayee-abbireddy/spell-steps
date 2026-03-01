import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import GameScene3D from './GameScene3D';
import WordInput from './WordInput';
import GameStatus from './GameStatus';
import GameOver from './GameOver';
import { playSound } from '../utils/soundUtils';

const GameScreen = () => {
  const { state, dispatch } = useGame();
  const timerRef = useRef<number | null>(null);

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
      <GameScene3D />

      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {/* Game status bar */}
        <div className="pointer-events-auto">
          <GameStatus />
        </div>

        {/* Game area */}
        <div className="flex-grow relative">
        </div>

        {/* Word input area - absolute positioning so it doesn't push layout */}
        {state.gameStatus === 'playing' ? (
          <div className="absolute bottom-0 w-full p-4 bg-white/80 backdrop-blur-sm pointer-events-auto">
            <WordInput />
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full z-[99999] bg-black/60 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4">
            <GameOver />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;