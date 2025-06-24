import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { Unit } from '../../../../game/models/Unit';
import { cn } from '@/lib/utils';
import { useGameStore } from '../../../store/gameStore';
import { Shield, Swords } from 'lucide-react';

interface BoardSlotProps {
  unit: Unit | null;
  index: number;
  row: 'frontLine' | 'reinforcement';
  isPlayerBoard: boolean;
  onDrop?: (cardId: string, sourceIndex: number) => void;
}

const BoardSlot: React.FC<BoardSlotProps> = ({ unit, index, row, isPlayerBoard, onDrop }) => {
  const { selectFrontLineSlot, selectReinforcementSlot } = useGameStore();
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'card',
    drop: (item: any) => {
      if (onDrop) {
        onDrop(item.cardId, item.sourceIndex);
      }
    },
    canDrop: (_item: any) => {
      // Add logic to check if card can be dropped here
      return isPlayerBoard;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleClick = () => {
    if (!isPlayerBoard) return;
    
    if (row === 'frontLine') {
      selectFrontLineSlot(index);
    } else {
      selectReinforcementSlot(index);
    }
  };

  return (
    <motion.div
      ref={drop as any}
      className={cn(
        'relative w-36 h-48 rounded-lg border-2 border-dashed transition-all',
        isOver && canDrop && 'border-green-500 bg-green-500/10',
        isOver && !canDrop && 'border-red-500 bg-red-500/10',
        !isOver && 'border-gray-600 bg-gray-800/30',
        'flex items-center justify-center'
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
    >
      {unit ? (
        <GameCard
          unit={unit}
          size="medium"
          isFaceDown={unit.faceDown}
          className="absolute inset-0"
        />
      ) : (
        <div className="text-gray-600 text-sm">
          {row === 'frontLine' ? 'Front Line' : 'Reinforcement'}
          <div className="text-xs">Slot {index + 1}</div>
        </div>
      )}
      
      {/* Position indicators */}
      {row === 'frontLine' && index === 2 && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-500">
          Center
        </div>
      )}
      {row === 'frontLine' && (index === 0 || index === 4) && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-500">
          Flank
        </div>
      )}
    </motion.div>
  );
};

interface GameBoardProps {
  isPlayerBoard: boolean;
  frontLine: (Unit | null)[];
  reinforcementRow: (Unit | null)[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  isPlayerBoard,
  frontLine,
  reinforcementRow,
}) => {
  const { playerId } = useGameStore();

  const handleCardDrop = (row: 'frontLine' | 'reinforcement') => (cardId: string, sourceIndex: number) => {
    if (!playerId) return;
    
    // Handle card drop logic
    console.log(`Dropped card ${cardId} to ${row} from index ${sourceIndex}`);
  };

  return (
    <div className={cn(
      'space-y-4 p-4 rounded-lg',
      isPlayerBoard ? 'bg-blue-900/20' : 'bg-red-900/20'
    )}>
      {/* Player indicator */}
      <div className="flex items-center justify-center gap-2 text-sm font-bold">
        {isPlayerBoard ? (
          <>
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Your Forces</span>
          </>
        ) : (
          <>
            <Swords className="w-4 h-4 text-red-400" />
            <span className="text-red-400">Enemy Forces</span>
          </>
        )}
      </div>

      {/* Front Line */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-300 text-center">Front Line</h3>
        <div className="flex gap-2 justify-center">
          {frontLine.map((unit, index) => (
            <BoardSlot
              key={`front-${index}`}
              unit={unit}
              index={index}
              row="frontLine"
              isPlayerBoard={isPlayerBoard}
              onDrop={handleCardDrop('frontLine')}
            />
          ))}
        </div>
      </div>

      {/* Combat Line */}
      <div className="border-t-2 border-gray-600 my-4" />

      {/* Reinforcement Row */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-300 text-center">Reinforcement Row</h3>
        <div className="flex gap-2 justify-center">
          {reinforcementRow.map((unit, index) => (
            <BoardSlot
              key={`reinforce-${index}`}
              unit={unit}
              index={index}
              row="reinforcement"
              isPlayerBoard={isPlayerBoard}
              onDrop={handleCardDrop('reinforcement')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};