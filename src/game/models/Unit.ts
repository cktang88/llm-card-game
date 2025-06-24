export type DamageType = 'health' | 'morale' | 'both';
export type AbilityType = 'center' | 'flank' | 'synergy' | 'passive' | 'reinforcement';
export type BoardPosition = {
  row: 'frontLine' | 'reinforcement';
  slot: number;
};

export interface AbilityCondition {
  type: 'position' | 'adjacency' | 'unitType' | 'always';
  value?: any;
}

export interface AbilityEffect {
  type: 'buff' | 'damage' | 'heal' | 'draw' | 'moraleBoost' | 'special';
  target: 'self' | 'adjacent' | 'enemy' | 'allFriendly' | 'allEnemy' | 'player';
  value: number | string;
  description: string;
}

export interface Ability {
  id: string;
  name: string;
  type: AbilityType;
  effect: AbilityEffect;
  condition?: AbilityCondition;
  description: string;
}

export interface Unit {
  id: string;
  cardId: string;
  name: string;
  baseHealth: number;
  currentHealth: number;
  baseMorale: number;
  currentMorale: number;
  delay: number;
  damageType: DamageType;
  abilities: Ability[];
  position?: BoardPosition;
  turnsInReserve: number;
  ownerId: string;
  faceDown: boolean;
}

export interface Card {
  id: string;
  name: string;
  faction: string;
  baseHealth: number;
  baseMorale: number;
  delay: number;
  damageType: DamageType;
  abilities: Ability[];
  cost?: number;
  description: string;
  imageUrl?: string;
}

export function createUnitFromCard(card: Card, ownerId: string): Unit {
  return {
    id: `unit-${Date.now()}-${Math.random()}`,
    cardId: card.id,
    name: card.name,
    baseHealth: card.baseHealth,
    currentHealth: card.baseHealth,
    baseMorale: card.baseMorale,
    currentMorale: card.baseMorale,
    delay: card.delay,
    damageType: card.damageType,
    abilities: [...card.abilities],
    turnsInReserve: 0,
    ownerId,
    faceDown: true,
  };
}

export function getUnitPower(unit: Unit): number {
  return unit.currentMorale;
}