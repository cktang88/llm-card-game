import React from 'react';
import { useDrag } from 'react-dnd';
import { GameCard } from './GameCard';
import { Card } from '../../../../game/models/Unit';
import { useGameStore } from '../../../store/gameStore';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  card: Card;
  index: number;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, index }) => {
  const { selectCard, hoverCard, canPlayCard, selectedCard, hoveredCard } = useGameStore();
  
  const canDrag = canPlayCard();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { cardId: card.id, sourceIndex: index, sourceType: 'hand' },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [card.id, index, canDrag]);

  return (
    <div
      ref={drag as any}
      className={cn(
        'transition-all transform-gpu',
        isDragging && 'opacity-50',
        canPlayCard() ? 'cursor-grab active:cursor-grabbing' : 'opacity-60 cursor-not-allowed',
        hoveredCard?.id === card.id && '-translate-y-5'
      )}
      style={{
        transform: hoveredCard?.id === card.id ? 'translateY(-20px)' : 'translateY(0)',
      }}
    >
      <GameCard
        card={card}
        size="medium"
        isSelected={selectedCard?.id === card.id}
        isHovered={hoveredCard?.id === card.id}
        onClick={() => selectCard(card)}
        onHover={() => hoverCard(card)}
        onHoverEnd={() => hoverCard(null)}
        isDraggable={canPlayCard()}
      />
    </div>
  );
};

interface PlayerHandProps {
  cards: Card[];
}

export const PlayerHand: React.FC<PlayerHandProps> = ({ cards }) => {
  const { isMyTurn } = useGameStore();

  return (
    <div className="relative w-full">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-t-lg p-2 select-none">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-white">Your Hand</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Cards: {cards.length}</span>
            {!isMyTurn() && (
              <span className="text-sm text-red-400 font-semibold">Opponent's Turn</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 justify-center overflow-x-auto py-1">
          {cards.length === 0 ? (
            <div className="text-gray-500 text-center py-4 text-sm">
              No cards in hand
            </div>
          ) : (
            cards.map((card, index) => (
              <DraggableCard key={card.id} card={card} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};