import { Monster, BattleRound, BattleResult } from '../types';

/**
 * Determina qual monstro ataca primeiro baseado na velocidade e ataque
 */
export function determineFirstAttacker(monster1: Monster, monster2: Monster): [Monster, Monster] {
  // Monstro com maior velocidade ataca primeiro
  if (monster1.speed > monster2.speed) {
    return [monster1, monster2];
  } else if (monster2.speed > monster1.speed) {
    return [monster2, monster1];
  }
  
  // Em caso de empate na velocidade, maior ataque vai primeiro
  if (monster1.attack > monster2.attack) {
    return [monster1, monster2];
  } else {
    return [monster2, monster1];
  }
}

/**
 * Calcula o dano de um ataque
 */
export function calculateDamage(attacker: Monster, defender: Monster): number {
  const damage = attacker.attack - defender.defense;
  // Dano mínimo é sempre 1
  return Math.max(1, damage);
}

/**
 * Aplica dano a um monstro e retorna o monstro atualizado
 */
export function applyDamage(monster: Monster, damage: number): Monster {
  return {
    ...monster,
    hp: Math.max(0, monster.hp - damage)
  };
}

/**
 * Verifica se um monstro está morto (HP = 0)
 */
export function isMonsterDefeated(monster: Monster): boolean {
  return monster.hp <= 0;
}

/**
 * Executa uma batalha completa entre dois monstros
 */
export function executeBattle(monster1: Monster, monster2: Monster): BattleResult {
  const startTime = Date.now();
  
  // Cria cópias dos monstros para não modificar os originais
  let currentMonster1 = { ...monster1 };
  let currentMonster2 = { ...monster2 };
  
  // Determina ordem de ataque
  const [firstAttacker, firstDefender] = determineFirstAttacker(currentMonster1, currentMonster2);
  
  const rounds: BattleRound[] = [];
  let roundNumber = 1;
  let attacker = firstAttacker;
  let defender = firstDefender;
  
  // Loop da batalha
  while (!isMonsterDefeated(currentMonster1) && !isMonsterDefeated(currentMonster2)) {
    // Calcula dano
    const damage = calculateDamage(attacker, defender);
    const defenderHpBefore = defender.hp;
    
    // Aplica dano
    if (defender.id === currentMonster1.id) {
      currentMonster1 = applyDamage(currentMonster1, damage);
      defender = currentMonster1;
    } else {
      currentMonster2 = applyDamage(currentMonster2, damage);
      defender = currentMonster2;
    }
    
    const isKillingBlow = isMonsterDefeated(defender);
    
    // Registra o round
    rounds.push({
      roundNumber,
      attacker: { ...attacker },
      defender: { ...defender },
      damage,
      defenderHpBefore,
      defenderHpAfter: defender.hp,
      isKillingBlow
    });
    
    // Se o defensor morreu, a batalha acabou
    if (isKillingBlow) {
      break;
    }
    
    // Troca os papéis para o próximo round
    [attacker, defender] = [defender, attacker];
    roundNumber++;
    
    // Proteção contra loop infinito (não deveria acontecer, mas é uma boa prática)
    if (roundNumber > 1000) {
      console.warn('Batalha interrompida após 1000 rounds para evitar loop infinito');
      break;
    }
  }
  
  const endTime = Date.now();
  
  // Determina vencedor e perdedor
  const winner = isMonsterDefeated(currentMonster1) ? currentMonster2 : currentMonster1;
  const loser = isMonsterDefeated(currentMonster1) ? currentMonster1 : currentMonster2;
  
  return {
    winner,
    loser,
    rounds,
    totalRounds: rounds.length,
    battleDuration: endTime - startTime
  };
}

/**
 * Reseta o HP de um monstro para o valor máximo
 */
export function resetMonsterHp(monster: Monster): Monster {
  return {
    ...monster,
    hp: monster.maxHp
  };
}

