import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Monster } from '../types';
import { generateSampleMonsters } from '../utils/monsterUtils';

interface MonsterState {
  monsters: Monster[];
  selectedMonsters: [Monster | null, Monster | null];
}

type MonsterAction =
  | { type: 'ADD_MONSTER'; payload: Monster }
  | { type: 'REMOVE_MONSTER'; payload: string }
  | { type: 'UPDATE_MONSTER'; payload: Monster }
  | { type: 'SELECT_MONSTER_1'; payload: Monster }
  | { type: 'SELECT_MONSTER_2'; payload: Monster }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'LOAD_MONSTERS'; payload: Monster[] }
  | { type: 'RESET_MONSTER_HP'; payload: string };

interface MonsterContextType {
  state: MonsterState;
  addMonster: (monster: Monster) => void;
  removeMonster: (id: string) => void;
  updateMonster: (monster: Monster) => void;
  selectMonster1: (monster: Monster) => void;
  selectMonster2: (monster: Monster) => void;
  clearSelection: () => void;
  resetMonsterHp: (id: string) => void;
  loadSampleMonsters: () => void;
}

const MonsterContext = createContext<MonsterContextType | undefined>(undefined);

const STORAGE_KEY = 'monster-battle-data';

function monsterReducer(state: MonsterState, action: MonsterAction): MonsterState {
  switch (action.type) {
    case 'ADD_MONSTER':
      return {
        ...state,
        monsters: [...state.monsters, action.payload]
      };
    
    case 'REMOVE_MONSTER':
      return {
        ...state,
        monsters: state.monsters.filter(monster => monster.id !== action.payload),
        selectedMonsters: [
          state.selectedMonsters[0]?.id === action.payload ? null : state.selectedMonsters[0],
          state.selectedMonsters[1]?.id === action.payload ? null : state.selectedMonsters[1]
        ]
      };
    
    case 'UPDATE_MONSTER':
      return {
        ...state,
        monsters: state.monsters.map(monster =>
          monster.id === action.payload.id ? action.payload : monster
        ),
        selectedMonsters: [
          state.selectedMonsters[0]?.id === action.payload.id ? action.payload : state.selectedMonsters[0],
          state.selectedMonsters[1]?.id === action.payload.id ? action.payload : state.selectedMonsters[1]
        ]
      };
    
    case 'SELECT_MONSTER_1':
      return {
        ...state,
        selectedMonsters: [action.payload, state.selectedMonsters[1]]
      };
    
    case 'SELECT_MONSTER_2':
      return {
        ...state,
        selectedMonsters: [state.selectedMonsters[0], action.payload]
      };
    
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedMonsters: [null, null]
      };
    
    case 'LOAD_MONSTERS':
      return {
        ...state,
        monsters: action.payload
      };
    
    case 'RESET_MONSTER_HP':
      return {
        ...state,
        monsters: state.monsters.map(monster =>
          monster.id === action.payload
            ? { ...monster, hp: monster.maxHp }
            : monster
        ),
        selectedMonsters: [
          state.selectedMonsters[0]?.id === action.payload
            ? { ...state.selectedMonsters[0], hp: state.selectedMonsters[0].maxHp }
            : state.selectedMonsters[0],
          state.selectedMonsters[1]?.id === action.payload
            ? { ...state.selectedMonsters[1], hp: state.selectedMonsters[1].maxHp }
            : state.selectedMonsters[1]
        ]
      };
    
    default:
      return state;
  }
}

const initialState: MonsterState = {
  monsters: [],
  selectedMonsters: [null, null]
};

interface MonsterProviderProps {
  children: ReactNode;
}

export function MonsterProvider({ children }: MonsterProviderProps) {
  const [state, dispatch] = useReducer(monsterReducer, initialState);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_MONSTERS', payload: parsedData });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        // Se houver erro, carrega monstros de exemplo
        dispatch({ type: 'LOAD_MONSTERS', payload: generateSampleMonsters() });
      }
    } else {
      // Se não há dados salvos, carrega monstros de exemplo
      dispatch({ type: 'LOAD_MONSTERS', payload: generateSampleMonsters() });
    }
  }, []);

  // Salvar dados no localStorage sempre que a lista de monstros mudar
  useEffect(() => {
    if (state.monsters.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.monsters));
    }
  }, [state.monsters]);

  const contextValue: MonsterContextType = {
    state,
    addMonster: (monster: Monster) => dispatch({ type: 'ADD_MONSTER', payload: monster }),
    removeMonster: (id: string) => dispatch({ type: 'REMOVE_MONSTER', payload: id }),
    updateMonster: (monster: Monster) => dispatch({ type: 'UPDATE_MONSTER', payload: monster }),
    selectMonster1: (monster: Monster) => dispatch({ type: 'SELECT_MONSTER_1', payload: monster }),
    selectMonster2: (monster: Monster) => dispatch({ type: 'SELECT_MONSTER_2', payload: monster }),
    clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
    resetMonsterHp: (id: string) => dispatch({ type: 'RESET_MONSTER_HP', payload: id }),
    loadSampleMonsters: () => dispatch({ type: 'LOAD_MONSTERS', payload: generateSampleMonsters() })
  };

  return (
    <MonsterContext.Provider value={contextValue}>
      {children}
    </MonsterContext.Provider>
  );
}

export function useMonsters() {
  const context = useContext(MonsterContext);
  if (context === undefined) {
    throw new Error('useMonsters deve ser usado dentro de um MonsterProvider');
  }
  return context;
}

