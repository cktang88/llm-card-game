import { Card } from '../../../../game/models/Unit';
import { Deck } from '../../../store/deckBuilderStore';

export interface ExportedDeck {
  name: string;
  faction: string;
  cardIds: string[];
  version: string;
}

export function exportDeck(deck: Deck): string {
  const exportData: ExportedDeck = {
    name: deck.name,
    faction: deck.faction,
    cardIds: deck.cards.map(card => card.id),
    version: '1.0',
  };
  
  return btoa(JSON.stringify(exportData));
}

export function importDeck(deckCode: string, availableCards: Card[]): Deck | null {
  try {
    const decoded = atob(deckCode);
    const data: ExportedDeck = JSON.parse(decoded);
    
    if (!data.version || !data.cardIds || !Array.isArray(data.cardIds)) {
      throw new Error('Invalid deck format');
    }
    
    const cards: Card[] = [];
    for (const cardId of data.cardIds) {
      const card = availableCards.find(c => c.id === cardId);
      if (card) {
        cards.push(card);
      }
    }
    
    if (cards.length < 20) {
      throw new Error('Imported deck has too few valid cards');
    }
    
    return {
      id: `deck-${Date.now()}`,
      name: data.name || 'Imported Deck',
      cards,
      faction: data.faction || 'Ashen Legion',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Failed to import deck:', error);
    return null;
  }
}