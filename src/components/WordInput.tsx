import { useState, useRef, useEffect, FormEvent } from 'react';
import { useGame } from '../context/GameContext';
import { isValidWord } from '../utils/wordValidator';
import { calculateWordScore, generateStoneFromWord } from '../utils/gameUtils';
import { playSound } from '../utils/soundUtils';
import { Sparkles } from 'lucide-react';

const WordInput = () => {
  const [inputWord, setInputWord] = useState('');
  const { state, dispatch } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Listen for suggested word from Gem
  useEffect(() => {
    if (state.suggestedWord) {
      setInputWord(state.suggestedWord);
      dispatch({ type: 'CLEAR_SUGGESTED_WORD' });
    }
  }, [state.suggestedWord, dispatch]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Trim and validate input word
    const word = inputWord.trim().toLowerCase();

    if (!word) return;

    // Clear input regardless of validity
    setInputWord('');

    // Check if word has already been used in this level
    const alreadyUsed = state.words.some(w => w.word === word);

    if (alreadyUsed) {
      dispatch({ type: 'SET_WORD_VALIDITY', payload: false });
      dispatch({
        type: 'SET_MESSAGE',
        payload: `You already used "${word}" in this level! Try a new one.`
      });
      playSound('invalid');
      return;
    }

    // Check if word is valid
    const valid = await isValidWord(word);

    // Set word validity (for UI feedback)
    dispatch({ type: 'SET_WORD_VALIDITY', payload: valid });

    if (valid) {
      // Calculate score for the word
      const score = calculateWordScore(word);

      // Generate a stone based on the word
      const stone = generateStoneFromWord(word, state.currentPosition, score, state.stones.length);

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

      // Calculate diamond logic for notification
      const isLongWord = word.length > 7;
      const currentLongWords = state.totalLongWords || 0;
      const earnedDiamond = isLongWord && ((currentLongWords + 1) % 5 === 0);

      // Set success message
      let msg = stone.special
        ? `Amazing! "${word}" created a special stone!`
        : `Good job! "${word}" added a stone.`;

      if (earnedDiamond) {
        msg = `💎 You earned a Gem for typing 5 long words! 💎 ` + msg;
      }

      dispatch({
        type: 'SET_MESSAGE',
        payload: msg
      });

      // Play success sound
      if (earnedDiamond) {
        playSound('win');
      } else {
        playSound(stone.special ? 'special' : 'success');
      }
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
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Game Message Bubble */}
      <div className={`mb-2 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-lg font-bold shadow-lg flex items-center transform transition-all 
        ${state.lastWordValid === true ? 'bg-green-100 text-green-800 border-2 border-green-400 scale-105' :
          state.lastWordValid === false ? 'bg-red-100 text-red-800 border-2 border-red-400 scale-105' :
            'bg-white text-sky-800 border-2 border-sky-300'}`}>
        {state.lastWordValid === true && <span className="mr-2">✨</span>}
        {state.lastWordValid === false && <span className="mr-2">❌</span>}
        <span className="truncate">{state.message}</span>
      </div>

      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="flex w-full relative">
          <input
            ref={inputRef}
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            className={`w-full p-3 md:p-5 pl-4 md:pl-8 pr-28 md:pr-32 text-xl md:text-3xl font-black bg-white/90 backdrop-blur-md border-b-4 md:border-b-8 border-r-2 md:border-r-4 border-l-2 md:border-l-4 border-t-2 md:border-t-4 rounded-2xl md:rounded-3xl outline-none transition-all duration-300
              uppercase tracking-widest placeholder-gray-400 text-sky-900 focus:bg-white
              ${state.lastWordValid === true
                ? 'border-green-400 focus:border-green-500 shadow-[0_0_20px_rgb(74,222,128)]'
                : state.lastWordValid === false
                  ? 'border-red-400 focus:border-red-500 shadow-[0_0_20px_rgb(248,113,113)]'
                  : 'border-sky-300 focus:border-sky-500 shadow-xl'
              }
            `}
            placeholder="TYPE WORD"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="absolute right-2 md:right-3 top-2 md:top-3 bottom-3 md:bottom-5 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-yellow-900 border-b-2 md:border-b-4 border-yellow-600 px-3 md:px-6 rounded-xl md:rounded-2xl transition-all duration-200 flex items-center justify-center font-black text-sm md:text-xl hover:-translate-y-1 hover:border-b-4 md:hover:border-b-8 active:translate-y-1 md:active:translate-y-2 active:border-b-0"
          >
            <span className="hidden md:inline">MAGIC!</span>
            <span className="md:hidden">GO</span>
            <Sparkles className="ml-1 md:ml-2 w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="hidden md:block absolute -bottom-8 left-0 right-0 text-center">
          <div className="inline-block bg-black/40 text-white backdrop-blur-sm px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-md">
            Longer words = Bigger stones!
          </div>
        </div>
      </form>
    </div>
  );
};

export default WordInput;