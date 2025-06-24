import React from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
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
  
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { cardId: card.id, sourceIndex: index, sourceType: 'hand' },
    canDrag: () => canPlayCard(card),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag as any}
      className={cn(
        'cursor-pointer transition-all',
        isDragging && 'opacity-50',
        !canPlayCard(card) && 'opacity-60 cursor-not-allowed'
      )}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        y: hoveredCard?.id === card.id ? -20 : 0,
      }}
      transition={{ 
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: index * 0.1,
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
        isDraggable={canPlayCard(card)}
      />
    </motion.div>
  );
};

interface PlayerHandProps {
  cards: Card[];
}

export const PlayerHand: React.FC<PlayerHandProps> = ({ cards }) => {
  const { isMyTurn } = useGameStore();

  return (
    <div className="relative w-full">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-t-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white">Your Hand</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Cards: {cards.length}</span>
            {!isMyTurn() && (
              <span className="text-sm text-red-400 font-semibold">Opponent's Turn</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 justify-center overflow-x-auto py-2">
          {cards.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
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