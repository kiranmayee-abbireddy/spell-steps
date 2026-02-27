import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
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
  message: 'Type words to create stones and cross the river!'
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
    case 'ADD_WORD':
      return {
        ...state,
        words: [...state.words, action.payload]
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload
      };
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: state.score + action.payload
      };
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
    case 'RESET_GAME':
      return {
        ...initialState,
        character: getRandomCharacter(characters),
        gameMode: state.gameMode
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
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

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