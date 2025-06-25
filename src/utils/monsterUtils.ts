import { v4 as uuidv4 } from 'uuid';
import { Monster, MonsterFormData, ValidationErrors } from '../types';

/**
 * Valida os dados do formulário de monstro
 */
export function validateMonsterForm(data: MonsterFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  
  // Validar nome
  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Nome deve ter no máximo 50 caracteres';
  }
  
  // Validar ataque
  const attack = parseInt(data.attack);
  if (!data.attack || isNaN(attack)) {
    errors.attack = 'Ataque deve ser um número';
  } else if (attack < 1) {
    errors.attack = 'Ataque deve ser pelo menos 1';
  } else if (attack > 200) {
    errors.attack = 'Ataque deve ser no máximo 200';
  }
  
  // Validar defesa
  const defense = parseInt(data.defense);
  if (!data.defense || isNaN(defense)) {
    errors.defense = 'Defesa deve ser um número';
  } else if (defense < 1) {
    errors.defense = 'Defesa deve ser pelo menos 1';
  } else if (defense > 200) {
    errors.defense = 'Defesa deve ser no máximo 200';
  }
  
  // Validar velocidade
  const speed = parseInt(data.speed);
  if (!data.speed || isNaN(speed)) {
    errors.speed = 'Velocidade deve ser um número';
  } else if (speed < 1) {
    errors.speed = 'Velocidade deve ser pelo menos 1';
  } else if (speed > 200) {
    errors.speed = 'Velocidade deve ser no máximo 200';
  }
  
  // Validar HP
  const hp = parseInt(data.hp);
  if (!data.hp || isNaN(hp)) {
    errors.hp = 'HP deve ser um número';
  } else if (hp < 1) {
    errors.hp = 'HP deve ser pelo menos 1';
  } else if (hp > 1000) {
    errors.hp = 'HP deve ser no máximo 1000';
  }
  
  // Validar URL da imagem
  if (!data.imageUrl.trim()) {
    errors.imageUrl = 'URL da imagem é obrigatória';
  } else if (!isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'URL da imagem deve ser válida';
  }
  
  return errors;
}

/**
 * Verifica se uma string é uma URL válida
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Cria um novo monstro a partir dos dados do formulário
 */
export function createMonsterFromForm(data: MonsterFormData): Monster {
  const id = uuidv4();
  const hp = parseInt(data.hp);
  
  return {
    id,
    name: data.name.trim(),
    attack: parseInt(data.attack),
    defense: parseInt(data.defense),
    speed: parseInt(data.speed),
    hp,
    maxHp: hp,
    imageUrl: data.imageUrl.trim()
  };
}

/**
 * Calcula o poder total de um monstro (para ranking)
 */
export function calculateMonsterPower(monster: Monster): number {
  return monster.attack + monster.defense + monster.speed + monster.hp;
}

/**
 * Ordena monstros por poder total (decrescente)
 */
export function sortMonstersByPower(monsters: Monster[]): Monster[] {
  return [...monsters].sort((a, b) => calculateMonsterPower(b) - calculateMonsterPower(a));
}

/**
 * Gera dados de exemplo para testes
 */
export function generateSampleMonsters(): Monster[] {
  return [
    {
      id: uuidv4(),
      name: 'Dragão de Fogo',
      attack: 85,
      defense: 60,
      speed: 70,
      hp: 120,
      maxHp: 120,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: uuidv4(),
      name: 'Lobo Sombrio',
      attack: 75,
      defense: 45,
      speed: 95,
      hp: 80,
      maxHp: 80,
      imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=400&fit=crop'
    },
    {
      id: uuidv4(),
      name: 'Golem de Pedra',
      attack: 60,
      defense: 90,
      speed: 30,
      hp: 150,
      maxHp: 150,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'
    },
    {
      id: uuidv4(),
      name: 'Fênix Dourada',
      attack: 90,
      defense: 55,
      speed: 85,
      hp: 100,
      maxHp: 100,
      imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=400&fit=crop'
    }
  ];
}

