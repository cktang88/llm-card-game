import { Card } from '../../../../game/models/Unit';

export interface DeckStats {
  totalCards: number;
  averageDelay: number;
  delayDistribution: Record<number, number>;
  typeDistribution: Record<string, number>;
  averageHealth: number;
  averageMorale: number;
  rarityDistribution: Record<string, number>;
}

export function calculateDeckStats(cards: Card[]): DeckStats {
  if (cards.length === 0) {
    return {
      totalCards: 0,
      averageDelay: 0,
      delayDistribution: {},
      typeDistribution: {},
      averageHealth: 0,
      averageMorale: 0,
      rarityDistribution: {},
    };
  }

  const stats: DeckStats = {
    totalCards: cards.length,
    averageDelay: 0,
    delayDistribution: {},
    typeDistribution: {},
    averageHealth: 0,
    averageMorale: 0,
    rarityDistribution: {},
  };

  let totalDelay = 0;
  let totalHealth = 0;
  let totalMorale = 0;

  cards.forEach((card) => {
    // Delay
    totalDelay += card.delay;
    stats.delayDistribution[card.delay] = (stats.delayDistribution[card.delay] || 0) + 1;

    // Damage Type
    stats.typeDistribution[card.damageType] = (stats.typeDistribution[card.damageType] || 0) + 1;

    // Health & Morale
    totalHealth += card.baseHealth;
    totalMorale += card.baseMorale;

    // Rarity (based on index in original array)
    const rarity = getRarityByCardId(card.id);
    stats.rarityDistribution[rarity] = (stats.rarityDistribution[rarity] || 0) + 1;
  });

  stats.averageDelay = totalDelay / cards.length;
  stats.averageHealth = totalHealth / cards.length;
  stats.averageMorale = totalMorale / cards.length;

  return stats;
}

function getRarityByCardId(cardId: string): string {
  const idNum = parseInt(cardId.split('-')[1]);
  if (idNum <= 12) return 'common';
  if (idNum <= 20) return 'uncommon';
  if (idNum <= 25) return 'rare';
  return 'legendary';
}