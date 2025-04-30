import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { isValidWord } from '../utils/wordValidator';
import { calculateWordScore, generateStoneFromWord } from '../utils/gameUtils';
import { playSound } from '../utils/soundUtils';

const WordInput: React.FC = () => {
  const [inputWord, setInputWord] = useState('');
  const { state, dispatch } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim and validate input word
    const word = inputWord.trim().toLowerCase();
    
    if (!word) return;
    
    // Clear input regardless of validity
    setInputWord('');
    
    // Check if word is valid
    const valid = await isValidWord(word);
    
    // Set word validity (for UI feedback)
    dispatch({ type: 'SET_WORD_VALIDITY', payload: valid });
    
    if (valid) {
      // Calculate score for the word
      const score = calculateWordScore(word);
      
      // Generate a stone based on the word
      const stone = generateStoneFromWord(word, state.stones.length, score);
      
      // Add stone to the game
      dispatch({ type: 'ADD_STONE', payload: stone });
      
      // Add word to history
      dispatch({
        type: 'ADD_WORD',
        payload: {
          word,
          timestamp: Date.now(),
          points: score,
          special: stone.special
        }
      });
      
      // Update score
      dispatch({ type: 'UPDATE_SCORE', payload: score });
      
      // Move character to the new stone's position
      dispatch({ type: 'MOVE_CHARACTER', payload: stone.position });
      
      // Set success message
      dispatch({
        type: 'SET_MESSAGE',
        payload: stone.special 
          ? `Amazing! "${word}" created a special stone!` 
          : `Good job! "${word}" added a stone.`
      });
      
      // Play success sound
      playSound(stone.special ? 'special' : 'success');
    } else {
      // Set failure message
      dispatch({
        type: 'SET_MESSAGE',
        payload: `"${word}" is not a valid word. Try again!`
      });
      
      // Play fail sound
      playSound('invalid');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="mb-2 text-center text-sm md:text-base text-gray-600">
          {state.message}
        </div>
        
        <div className="flex w-full">
          <input
            ref={inputRef}
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            className={`flex-grow p-3 text-lg border-2 rounded-l-lg outline-none transition-colors duration-200 ${
              state.lastWordValid === true
                ? 'border-green-400 bg-green-50'
                : state.lastWordValid === false
                ? 'border-red-400 bg-red-50'
                : 'border-blue-300 bg-white'
            }`}
            placeholder="Type a word..."
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-r-lg transition-colors duration-200"
          >
            Step!
          </button>
        </div>
        
        <div className="mt-2 text-xs md:text-sm text-gray-500 text-center">
          <span className="font-medium">Hint:</span> Longer words create bigger stones!
        </div>
      </div>
    </form>
  );
};

export default WordInput;