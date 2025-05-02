import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface Player {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number; z: number };
  resources: number;
  score: number;
  currentDay: number;
  values: {
    innovation: number;
    integrity: number;
    collaboration: number;
    excellence: number;
    userFocus: number;
  };
  decisions: {
    day: number;
    impact: {
      resources: number;
      values: { [key: string]: number };
    };
  }[];
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    resourceCost: number;
    valueEffect: { type: string; amount: number }[];
  }[];
}

// Export the MiniGame interface so it can be imported elsewhere
export interface MiniGame {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'pending' | 'active' | 'completed';
  reward: number;
}

interface Calendar {
  specialEvents: {
    day: number;
    title: string;
    description: string;
  }[];
  weekends: number[];
}

interface GameState {
  gameStarted: boolean;
  gameEnded: boolean;
  currentDay: number;
  totalDays: number;
  level: number;
  teamResources: number;
  players: Player[];
  currentTurn: string;
  currentScenario: Scenario | null;
  activeMiniGame: MiniGame | null;
  calendar: Calendar;
}

// Initial state
const initialState: GameState = {
  gameStarted: false,
  gameEnded: false,
  currentDay: 1,
  totalDays: 30,
  level: 1,
  teamResources: 5000,
  players: [],
  currentTurn: '',
  currentScenario: null,
  activeMiniGame: null,
  calendar: {
    specialEvents: [],
    weekends: [6, 7, 13, 14, 20, 21, 27, 28]
  }
};

// Action types
type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'NEXT_DAY' }
  | { type: 'SELECT_TILE'; tileType: string; position: number[] }
  | { type: 'SELECT_SCENARIO_OPTION'; playerId: string; scenarioId: string; optionId: string }
  | { type: 'START_MINI_GAME'; miniGameId: string }
  | { type: 'COMPLETE_MINI_GAME'; results: { teamResourceGain: number; teamValueGains: { [key: string]: number } } };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true,
        players: [
          {
            id: '1',
            name: 'Player 1',
            color: '#3B82F6',
            position: { x: 0, y: 0, z: 0 },
            resources: 1000,
            score: 0,
            currentDay: 1,
            values: {
              innovation: 50,
              integrity: 50,
              collaboration: 50,
              excellence: 50,
              userFocus: 50
            },
            decisions: []
          }
        ],
        currentTurn: '1'
      };
    case 'END_GAME':
      return { ...state, gameEnded: true };
    case 'NEXT_DAY':
      return {
        ...state,
        currentDay: state.currentDay + 1,
        currentTurn: state.players[0].id
      };
    case 'SELECT_TILE':
      return state;
    case 'SELECT_SCENARIO_OPTION':
      return state;
    case 'START_MINI_GAME':
      return state;
    case 'COMPLETE_MINI_GAME':
      return {
        ...state,
        teamResources: state.teamResources + action.results.teamResourceGain,
        activeMiniGame: null
      };
    default:
      return state;
  }
}

// Context
interface GameContextType {
  gameState: GameState;
  currentPlayer: Player | undefined;
  startGame: () => void;
  endGame: () => void;
  nextDay: () => void;
  selectTile: (tileType: string, position: number[]) => void;
  selectScenarioOption: (playerId: string, scenarioId: string, optionId: string) => void;
  completeMiniGame: (results: { teamResourceGain: number; teamValueGains: { [key: string]: number } }) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Get current player
  const currentPlayer = state.players.find(p => p.id === state.currentTurn);
  
  // Actions
  const startGame = () => dispatch({ type: 'START_GAME' });
  const endGame = () => dispatch({ type: 'END_GAME' });
  const nextDay = () => dispatch({ type: 'NEXT_DAY' });
  const selectTile = (tileType: string, position: number[]) => 
    dispatch({ type: 'SELECT_TILE', tileType, position });
  const selectScenarioOption = (playerId: string, scenarioId: string, optionId: string) => 
    dispatch({ type: 'SELECT_SCENARIO_OPTION', playerId, scenarioId, optionId });
  const completeMiniGame = (results: { teamResourceGain: number; teamValueGains: { [key: string]: number } }) =>
    dispatch({ type: 'COMPLETE_MINI_GAME', results });
  
  return (
    <GameContext.Provider value={{
      gameState: state,
      currentPlayer,
      startGame,
      endGame,
      nextDay,
      selectTile,
      selectScenarioOption,
      completeMiniGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the context
export const useGameState = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};