import { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import {
  Stone,
  GameMode,
  Character,
  GameStatus,
  WordHistory
} from '../types/gameTypes';
import { characters } from '../data/characters';
import { getRandomCharacter } from '../utils/gameUtils';

// Define game state
interface GameState {
  stones: Stone[];
  character: Character;
  score: number;
  words: WordHistory[];
  gameMode: GameMode;
  gameStatus: GameStatus;
  timeRemaining: number;
  currentPosition: number;
  targetPosition: number;
  lastWordValid: boolean | null;
  message: string;
  level: number;
  stars: number;
  highScore: number;
  totalLongWords: number;
  diamonds: number;
}

// Initial game state
const initialState: GameState = {
  stones: [],
  character: getRandomCharacter(characters),
  score: 0,
  words: [],
  gameMode: 'casual',
  gameStatus: 'ready',
  timeRemaining: 60,
  currentPosition: 0,
  targetPosition: 100,
  lastWordValid: null,
  message: 'Type words to create stones and cross the river!',
  level: 1,
  stars: 0,
  highScore: 0,
  totalLongWords: 0,
  diamonds: 0
};

// Define action types
type GameAction =
  | { type: 'ADD_STONE'; payload: Stone }
  | { type: 'MOVE_CHARACTER'; payload: number }
  | { type: 'SET_GAME_MODE'; payload: GameMode }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'ADD_WORD'; payload: WordHistory }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'SET_WORD_VALIDITY'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESET_GAME' };

// Create reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_STONE':
      return {
        ...state,
        stones: [...state.stones, action.payload]
      };
    case 'MOVE_CHARACTER':
      return {
        ...state,
        currentPosition: action.payload,
        score: state.gameStatus === 'won' ? state.score :
          action.payload >= state.targetPosition
            ? state.score + (state.gameMode === 'timed' ? Math.floor(state.timeRemaining * 10) : 0)
            : state.score
      };
    case 'SET_GAME_MODE':
      return {
        ...state,
        gameMode: action.payload,
        timeRemaining: action.payload === 'timed' ? 60 : Infinity
      };
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.payload
      };
    case 'ADD_WORD': {
      const isLongWord = action.payload.word.length > 7;
      const newTotalLongWords = isLongWord ? (state.totalLongWords || 0) + 1 : (state.totalLongWords || 0);
      const newDiamonds = (isLongWord && newTotalLongWords > 0 && newTotalLongWords % 5 === 0)
        ? (state.diamonds || 0) + 1
        : (state.diamonds || 0);

      return {
        ...state,
        words: [...state.words, action.payload],
        totalLongWords: newTotalLongWords,
        diamonds: newDiamonds
      };
    }
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload
      };
    case 'UPDATE_SCORE': {
      const newScore = state.score + action.payload;
      return {
        ...state,
        score: newScore,
        // Earning 1 star for every 10 points
        stars: Math.floor(newScore / 10),
        highScore: Math.max(state.highScore ?? 0, newScore)
      };
    }
    case 'SET_WORD_VALIDITY':
      return {
        ...state,
        lastWordValid: action.payload
      };
    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload
      };
    case 'NEXT_LEVEL': {
      const nextLevel = state.level + 1;
      const unlockedNewSkin = state.level % 5 === 0;
      let newCharacter = state.character;
      let extraMessage = '';

      if (unlockedNewSkin) {
        const availableCharacters = characters.filter(c => c.id !== state.character.id);
        newCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        extraMessage = `Unlocked new skin: ${newCharacter.name} ${newCharacter.sprite}! 🎉`;
      }

      return {
        ...state,
        level: nextLevel,
        character: newCharacter,
        // Increase distance by 20 units each level
        targetPosition: state.targetPosition + 20,
        currentPosition: 0,
        stones: [],
        words: [],
        gameStatus: 'ready',
        message: unlockedNewSkin ? extraMessage : `Level ${nextLevel}! The river is getting wider.`,
        // Give base time + extra time for wider rivers in timed mode
        timeRemaining: state.gameMode === 'timed' ? 60 + (state.level * 10) : Infinity
      };
    }
    case 'RESET_GAME':
      return {
        ...initialState,
        highScore: state.highScore,
        character: getRandomCharacter(characters),
        gameMode: state.gameMode,
        // In case gameMode was timed, reset time properly based on initial level 1
        timeRemaining: state.gameMode === 'timed' ? 60 : Infinity
      };
    default:
      return state;
  }
}

// Create context
interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
function init(defaultState: GameState): GameState {
  try {
    const saved = localStorage.getItem('spellStepsGameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse saved game state', e);
  }
  return defaultState;
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, init);

  useEffect(() => {
    localStorage.setItem('spellStepsGameState', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook for using the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};