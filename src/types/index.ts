export interface Monster {
  id: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  maxHp: number; // Para reset após batalha
  imageUrl: string;
}

export interface BattleRound {
  roundNumber: number;
  attacker: Monster;
  defender: Monster;
  damage: number;
  defenderHpBefore: number;
  defenderHpAfter: number;
  isKillingBlow: boolean;
}

export interface BattleResult {
  winner: Monster;
  loser: Monster;
  rounds: BattleRound[];
  totalRounds: number;
  battleDuration: number; // em milissegundos
}

export interface BattleState {
  isInProgress: boolean;
  currentRound: number;
  monster1: Monster;
  monster2: Monster;
  result: BattleResult | null;
}

export type BattleAction = 
  | { type: 'START_BATTLE'; payload: { monster1: Monster; monster2: Monster } }
  | { type: 'NEXT_ROUND'; payload: BattleRound }
  | { type: 'END_BATTLE'; payload: BattleResult }
  | { type: 'RESET_BATTLE' };

export interface MonsterFormData {
  name: string;
  attack: string;
  defense: string;
  speed: string;
  hp: string;
  imageUrl: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

