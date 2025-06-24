import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '../../../../game/models/Unit';
import { GameCard } from '../../game/components/GameCard';

interface DraggableCardProps {
  card: Card;
  count?: number;
  onClick?: () => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({ card, count = 0, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="relative cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <GameCard card={card} size="medium" />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg">
          {count}
        </div>
      )}
    </div>
  );
};