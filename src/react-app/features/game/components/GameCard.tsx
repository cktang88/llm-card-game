import React from 'react';
import { motion } from 'framer-motion';
import { Card, Unit, getUnitPower } from '../../../../game/models/Unit';
import { cn } from '@/lib/utils';
import { Flame, Heart, Brain, Clock } from 'lucide-react';

interface GameCardProps {
  card?: Card;
  unit?: Unit;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  isDraggable?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  isFaceDown?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  unit,
  onClick,
  onHover,
  onHoverEnd,
  isDraggable: _isDraggable,
  isSelected,
  isHovered,
  isFaceDown = false,
  size = 'medium',
  className,
}) => {
  const data = unit || card;
  if (!data) return null;

  const sizeClasses = {
    small: 'w-20 h-28 text-xs',
    medium: 'w-32 h-44 text-sm',
    large: 'w-48 h-64 text-base',
  };

  const getDamageTypeIcon = () => {
    switch (data.damageType) {
      case 'health':
        return <Heart className="w-3 h-3" />;
      case 'morale':
        return <Brain className="w-3 h-3" />;
      case 'both':
        return <Flame className="w-3 h-3" />;
    }
  };

  const getDamageTypeColor = () => {
    switch (data.damageType) {
      case 'health':
        return 'text-red-500';
      case 'morale':
        return 'text-blue-500';
      case 'both':
        return 'text-purple-500';
    }
  };

  const currentHealth = unit ? unit.currentHealth : data.baseHealth;
  const currentMorale = unit ? unit.currentMorale : data.baseMorale;
  const power = unit ? getUnitPower(unit) : data.baseMorale;

  if (isFaceDown) {
    return (
      <motion.div
        className={cn(
          'relative rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-lg cursor-pointer select-none',
          sizeClasses[size],
          isSelected && 'border-yellow-500',
          isHovered && 'border-gray-500',
          className
        )}
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
        whileHover={{ scale: 1.1, zIndex: 50 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Flame className="w-8 h-8 text-gray-600" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-lg bg-gradient-to-br from-gray-900 to-black border-2 shadow-xl overflow-hidden cursor-pointer select-none',
        sizeClasses[size],
        isSelected && 'border-yellow-500',
        isHovered && 'border-blue-400',
        data.delay >= 3 && 'border-orange-600',
        data.delay === 4 && 'border-red-600',
        className
      )}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(0,0,0,0.9))`,
      }}
    >
      {/* Card Name */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1">
        <h3 className="font-bold text-white truncate">{data.name}</h3>
      </div>

      {/* Delay Indicator */}
      {data.delay > 0 && (
        <div className="absolute top-8 right-1 flex items-center gap-1 bg-black/70 rounded px-1">
          <Clock className="w-3 h-3 text-yellow-500" />
          <span className="text-yellow-500 font-bold">{data.delay}</span>
        </div>
      )}

      {/* Card Art Area */}
      <div className="absolute top-12 left-2 right-2 bottom-16 bg-gray-800/50 rounded flex items-center justify-center">
        <Flame className="w-12 h-12 text-gray-700" />
      </div>

      {/* Abilities */}
      <div className="absolute bottom-8 left-2 right-2 text-xs space-y-1">
        {data.abilities.slice(0, 2).map((ability, index) => (
          <div key={index} className="bg-black/70 rounded px-1 py-0.5">
            <span className="text-gray-300 font-medium">{ability.type}:</span>
            <span className="text-gray-400 ml-1 text-xs">{ability.name}</span>
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-2 py-1 flex justify-between items-center">
        {/* Health */}
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-white font-bold">
            {currentHealth}
            {unit && unit.currentHealth < unit.baseHealth && (
              <span className="text-gray-400 text-xs">/{unit.baseHealth}</span>
            )}
          </span>
        </div>

        {/* Power/Morale */}
        <div className="flex items-center gap-1">
          <span className={cn('font-bold text-lg', getDamageTypeColor())}>
            {power}
          </span>
          {getDamageTypeIcon()}
        </div>

        {/* Morale */}
        <div className="flex items-center gap-1">
          <Brain className="w-4 h-4 text-blue-500" />
          <span className="text-white font-bold">
            {currentMorale}
            {unit && unit.currentMorale < unit.baseMorale && (
              <span className="text-gray-400 text-xs">/{unit.baseMorale}</span>
            )}
          </span>
        </div>
      </div>

      {/* Unit-specific indicators */}
      {unit && unit.position?.row === 'reinforcement' && (
        <div className="absolute top-8 left-1 rounded px-1 py-0.5">
          {unit.turnsInReserve >= unit.delay ? (
            <div className="bg-green-600/80">
              <span className="text-white text-xs font-bold">Ready!</span>
            </div>
          ) : (
            <div className="bg-orange-600/80">
              <span className="text-white text-xs font-bold">
                {unit.delay - unit.turnsInReserve} turn{unit.delay - unit.turnsInReserve !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};