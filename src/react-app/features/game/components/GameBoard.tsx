import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { GameCard } from './GameCard';
import { Unit } from '../../../../game/models/Unit';
import { cn } from '@/lib/utils';
import { useGameStore } from '../../../store/gameStore';
import { Shield, Swords } from 'lucide-react';

interface DraggableUnitProps {
  unit: Unit;
  index: number;
  row: 'frontLine' | 'reinforcement';
  isPlayerBoard: boolean;
}

const DraggableUnit: React.FC<DraggableUnitProps> = ({ unit, index, row, isPlayerBoard }) => {
  const { canDeployUnit } = useGameStore();
  
  // Units can be dragged from reinforcement row to front line if delay is satisfied
  const canDrag = isPlayerBoard && row === 'reinforcement' && canDeployUnit(index);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'unit',
    item: { unitId: unit.id, sourceIndex: index, sourceRow: row },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [unit.id, index, row, canDrag]);

  return (
    <div
      ref={canDrag ? (drag as any) : null}
      className={cn(
        "w-full h-full",
        isDragging && 'opacity-50',
        canDrag && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <GameCard
        unit={unit}
        size="medium"
        isFaceDown={unit.faceDown}
        className="w-full h-full"
      />
      {canDrag && (
        <div className="absolute bottom-1 right-1 bg-green-600 text-white text-xs px-1 py-0.5 rounded">
          Ready
        </div>
      )}
    </div>
  );
};

interface BoardSlotProps {
  unit: Unit | null;
  index: number;
  row: 'frontLine' | 'reinforcement';
  isPlayerBoard: boolean;
  onDrop?: (cardId: string, sourceIndex: number, targetIndex: number) => void;
}

const BoardSlot: React.FC<BoardSlotProps> = ({ unit, index, row, isPlayerBoard, onDrop }) => {
  const { selectFrontLineSlot, selectReinforcementSlot } = useGameStore();
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['card', 'unit'],
    drop: (item: any) => {
      console.log('Drop detected:', item, 'at slot:', index, 'row:', row);
      if (onDrop) {
        if (item.cardId) {
          // Card from hand
          onDrop(item.cardId, item.sourceIndex, index);
        } else if (item.unitId && item.sourceRow === 'reinforcement') {
          // Unit from reinforcement row
          onDrop(item.unitId, item.sourceIndex, index);
        }
      }
    },
    canDrop: (item: any) => {
      if (!isPlayerBoard) return false;
      
      if (item.cardId) {
        // Card from hand can only go to empty reinforcement slots
        return row === 'reinforcement' && unit === null;
      } else if (item.unitId && item.sourceRow === 'reinforcement') {
        // Unit from reinforcement can only go to front line
        return row === 'frontLine';
      }
      
      return false;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [onDrop, isPlayerBoard, row, unit, index]);

  const handleClick = () => {
    if (!isPlayerBoard) return;
    
    if (row === 'frontLine') {
      selectFrontLineSlot(index);
    } else {
      selectReinforcementSlot(index);
    }
  };

  return (
    <div
      ref={drop as any}
      className={cn(
        'relative w-36 h-48 rounded-lg border-2 border-dashed transition-all',
        isOver && canDrop && 'border-green-500 bg-green-500/10',
        isOver && !canDrop && 'border-red-500 bg-red-500/10',
        !isOver && 'border-gray-600 bg-gray-800/30',
        'flex items-center justify-center hover:scale-[1.02]'
      )}
      onClick={handleClick}
    >
      {unit ? (
        <DraggableUnit
          unit={unit}
          index={index}
          row={row}
          isPlayerBoard={isPlayerBoard}
        />
      ) : (
        <div className="text-gray-600 text-xs">
          {row === 'frontLine' ? 'Front' : 'Reinforce'}
          <div className="text-xs">#{index + 1}</div>
        </div>
      )}
      
    </div>
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
  const { processAction, playerId, getCurrentPlayer } = useGameStore();

  const handleCardDrop = (row: 'frontLine' | 'reinforcement', targetIndex: number) => async (cardOrUnitId: string, sourceIndex: number) => {
    if (!playerId) return;
    
    // Check if this is a card from hand or a unit from reinforcement
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;
    
    // Check if it's a unit from reinforcement (will be in reinforcement row)
    const unitFromReinforcement = currentPlayer.reinforcementRow[sourceIndex];
    
    if (unitFromReinforcement && unitFromReinforcement.id === cardOrUnitId && row === 'frontLine') {
      // This is a unit being deployed from reinforcement to front line
      const success = await processAction({
        type: 'deployUnit',
        playerId,
        data: { 
          reinforcementSlot: sourceIndex,
          frontLineSlot: targetIndex
        },
      });
      
      if (success) {
        // Success toast is handled in processAction
      }
    } else if (row === 'reinforcement' && !unitFromReinforcement) {
      // This is a card being played from hand to reinforcement
      const success = await processAction({
        type: 'playUnit',
        playerId,
        data: { cardId: cardOrUnitId },
      });
      
      if (success) {
        // Success toast is handled in processAction
      }
    }
  };

  return (
    <div className={cn(
      'h-full flex flex-col p-3 rounded-lg select-none',
      isPlayerBoard ? 'bg-blue-900/20' : 'bg-red-900/20'
    )}>
      {/* Player indicator */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold mb-2">
        {isPlayerBoard ? (
          <>
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400">Your Forces</span>
          </>
        ) : (
          <>
            <Swords className="w-3 h-3 text-red-400" />
            <span className="text-red-400">Enemy Forces</span>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2">
        {isPlayerBoard ? (
          <>
            {/* Player Board: Front Line first (closer to combat zone) */}
            <div>
              <h3 className="text-xs font-semibold text-gray-300 text-center mb-1">Front Line</h3>
              <div className="flex gap-2 justify-center">
                {frontLine.map((unit, index) => (
                  <BoardSlot
                    key={`front-${index}`}
                    unit={unit}
                    index={index}
                    row="frontLine"
                    isPlayerBoard={isPlayerBoard}
                    onDrop={(cardId, sourceIndex, targetIndex) => handleCardDrop('frontLine', targetIndex)(cardId, sourceIndex)}
                  />
                ))}
              </div>
            </div>

            {/* Combat Line */}
            <div className="border-t-2 border-gray-600 my-2" />

            {/* Reinforcement Row */}
            <div>
              <h3 className="text-xs font-semibold text-gray-300 text-center mb-1">Reinforcement Row</h3>
              <div className="flex gap-2 justify-center">
                {reinforcementRow.map((unit, index) => (
                  <BoardSlot
                    key={`reinforce-${index}`}
                    unit={unit}
                    index={index}
                    row="reinforcement"
                    isPlayerBoard={isPlayerBoard}
                    onDrop={(cardId, sourceIndex, targetIndex) => handleCardDrop('reinforcement', targetIndex)(cardId, sourceIndex)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Enemy Board: Reinforcement Row first (farther from combat zone) */}
            <div>
              <h3 className="text-xs font-semibold text-gray-300 text-center mb-1">Reinforcement Row</h3>
              <div className="flex gap-2 justify-center">
                {reinforcementRow.map((unit, index) => (
                  <BoardSlot
                    key={`reinforce-${index}`}
                    unit={unit}
                    index={index}
                    row="reinforcement"
                    isPlayerBoard={isPlayerBoard}
                    onDrop={(cardId, sourceIndex, targetIndex) => handleCardDrop('reinforcement', targetIndex)(cardId, sourceIndex)}
                  />
                ))}
              </div>
            </div>

            {/* Combat Line */}
            <div className="border-t-2 border-gray-600 my-2" />

            {/* Front Line */}
            <div>
              <h3 className="text-xs font-semibold text-gray-300 text-center mb-1">Front Line</h3>
              <div className="flex gap-2 justify-center">
                {frontLine.map((unit, index) => (
                  <BoardSlot
                    key={`front-${index}`}
                    unit={unit}
                    index={index}
                    row="frontLine"
                    isPlayerBoard={isPlayerBoard}
                    onDrop={(cardId, sourceIndex, targetIndex) => handleCardDrop('frontLine', targetIndex)(cardId, sourceIndex)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};