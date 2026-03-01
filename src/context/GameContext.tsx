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
  totalRegularWords: number;
  diamonds: number;
  usedRandomWords: string[];
  suggestedWord: string | null;
}

// Initial game state (base)
export const initialState: GameState = {
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
  totalRegularWords: 0,
  diamonds: 0,
  usedRandomWords: [],
  suggestedWord: null
};

export interface RootState {
  activeMode: GameMode;
  casual: GameState;
  timed: GameState;
}

export const initialRootState: RootState = {
  activeMode: 'casual',
  casual: { ...initialState, gameMode: 'casual', timeRemaining: Infinity },
  timed: { ...initialState, gameMode: 'timed', timeRemaining: 60 }
};

// Define action types
export type GameAction =
  | { type: 'ADD_STONE'; payload: Stone }
  | { type: 'MOVE_CHARACTER'; payload: number }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'ADD_WORD'; payload: WordHistory }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'SET_WORD_VALIDITY'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESET_GAME' }
  | { type: 'USE_DIAMOND'; payload: string }
  | { type: 'CLEAR_SUGGESTED_WORD' };

export type RootAction =
  | GameAction
  | { type: 'SET_ACTIVE_MODE'; payload: GameMode };

// Create reducer function for individual game state
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
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.payload
      };
    case 'ADD_WORD': {
      const isLongWord = action.payload.word.length > 7;

      let newTotalLongWords = state.totalLongWords || 0;
      let newTotalRegularWords = state.totalRegularWords || 0;
      let earnedDiamond = false;

      if (isLongWord) {
        newTotalLongWords += 1;
        if (newTotalLongWords % 5 === 0) earnedDiamond = true;
      } else {
        newTotalRegularWords += 1;
        if (newTotalRegularWords % 15 === 0) earnedDiamond = true;
      }

      const newDiamonds = earnedDiamond
        ? (state.diamonds || 0) + 1
        : (state.diamonds || 0);

      return {
        ...state,
        words: [...state.words, action.payload],
        totalLongWords: newTotalLongWords,
        totalRegularWords: newTotalRegularWords,
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
    case 'USE_DIAMOND':
      return {
        ...state,
        diamonds: Math.max(0, state.diamonds - 1),
        usedRandomWords: [...(state.usedRandomWords || []), action.payload],
        message: `💎 Gem activated! Here is your magic word!`,
        suggestedWord: action.payload,
        lastWordValid: true
      };
    case 'CLEAR_SUGGESTED_WORD':
      return {
        ...state,
        suggestedWord: null
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        highScore: state.highScore,
        character: getRandomCharacter(characters),
        gameMode: state.gameMode,
        timeRemaining: state.gameMode === 'timed' ? 60 : Infinity
      };
    default:
      return state;
  }
}

// Create root reducer that directs actions to the active mode
function rootReducer(root: RootState, action: RootAction): RootState {
  if (action.type === 'SET_ACTIVE_MODE') {
    return {
      ...root,
      activeMode: action.payload
    };
  }

  // All other actions operate on the ACTIVE game mode state
  const currentMode = root.activeMode;
  const gameAction = action as GameAction;

  const newGameState = gameReducer(root[currentMode], gameAction);

  return {
    ...root,
    [currentMode]: newGameState
  };
}

// Create context
interface GameContextType {
  state: GameState; // exposes the currently active game state
  rootState: RootState; // exposes the raw multi-save structure
  dispatch: Dispatch<RootAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
function init(defaultState: RootState): RootState {
  try {
    const saved = localStorage.getItem('spellStepsRootState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse saved root state', e);
  }

  // Legacy migration (if they only had 'spellStepsGameState')
  try {
    const savedLegacy = localStorage.getItem('spellStepsGameState');
    if (savedLegacy) {
      const parsed = JSON.parse(savedLegacy);
      const mode = parsed.gameMode || 'casual';
      return {
        ...defaultState,
        activeMode: mode,
        [mode]: { ...initialState, ...parsed }
      };
    }
  } catch (e) { }

  return defaultState;
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [rootState, dispatch] = useReducer(rootReducer, initialRootState, init);

  useEffect(() => {
    localStorage.setItem('spellStepsRootState', JSON.stringify(rootState));
  }, [rootState]);

  const activeGameState = rootState[rootState.activeMode];

  return (
    <GameContext.Provider value={{ state: activeGameState, rootState, dispatch }}>
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