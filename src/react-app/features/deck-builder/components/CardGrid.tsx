import React from 'react';
import { Card } from '../../../../game/models/Unit';
import { DraggableCard } from './DraggableCard';
import { useDeckBuilderStore } from '../../../store/deckBuilderStore';
import { ASHEN_LEGION_CARDS } from '../../../../game/data/ashen-legion-cards';

export const CardGrid: React.FC = () => {
  const {
    searchQuery,
    selectedRarities,
    selectedDelays,
    selectedTypes,
    addCardToDeck,
    currentDeck,
  } = useDeckBuilderStore();

  // Get card counts in current deck
  const deckCardCounts = currentDeck.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Determine rarity based on card index
  const getCardRarity = (index: number): string => {
    if (index < 12) return 'common';
    if (index < 20) return 'uncommon';
    if (index < 25) return 'rare';
    return 'legendary';
  };

  // Filter cards
  const filteredCards = ASHEN_LEGION_CARDS.filter((card, index) => {
    // Search filter
    if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Rarity filter
    const rarity = getCardRarity(index);
    if (selectedRarities.length > 0 && !selectedRarities.includes(rarity)) {
      return false;
    }

    // Delay filter
    if (selectedDelays.length > 0 && !selectedDelays.includes(card.delay)) {
      return false;
    }

    // Damage type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(card.damageType)) {
      return false;
    }

    return true;
  });

  // Group cards by delay for display
  const cardsByDelay = filteredCards.reduce((acc, card) => {
    if (!acc[card.delay]) acc[card.delay] = [];
    acc[card.delay].push(card);
    return acc;
  }, {} as Record<number, Card[]>);

  const sortedDelays = Object.keys(cardsByDelay)
    .map(Number)
    .sort((a, b) => a - b);

  if (filteredCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No cards match your filters</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDelays.map(delay => (
        <div key={delay}>
          <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <span className="bg-gray-700 rounded px-2 py-1 text-sm">
              Delay {delay}
            </span>
            <span className="text-sm text-gray-500">
              ({cardsByDelay[delay].length} cards)
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cardsByDelay[delay].map((card) => {
              const count = deckCardCounts[card.id] || 0;
              const isMaxed = count >= 3;
              const cardIndex = ASHEN_LEGION_CARDS.findIndex(c => c.id === card.id);
              const rarity = getCardRarity(cardIndex);

              return (
                <div
                  key={card.id}
                  className={`relative ${isMaxed ? 'opacity-50' : ''}`}
                >
                  <DraggableCard
                    card={card}
                    count={count}
                    onClick={() => !isMaxed && addCardToDeck(card)}
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                    rarity === 'common' ? 'bg-gray-600' :
                    rarity === 'uncommon' ? 'bg-green-600' :
                    rarity === 'rare' ? 'bg-blue-600' :
                    'bg-purple-600'
                  }`}>
                    {rarity[0].toUpperCase()}
                  </div>
                  {isMaxed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="text-white font-bold">MAX</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};