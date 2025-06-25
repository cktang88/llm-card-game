import React from 'react';
import { motion } from 'framer-motion';
import { Card, Unit, getUnitPower } from '../../../../game/models/Unit';
import { cn } from '@/lib/utils';
import { Flame, Heart, Brain, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GameCardProps {
  card?: Card;
  unit?: Unit;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  isSelected?: boolean;
  isHovered?: boolean;
  isFaceDown?: boolean;
  canPreview?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  unit,
  onClick,
  onHover,
  onHoverEnd,
  isSelected,
  isHovered,
  isFaceDown = false,
  canPreview = false,
  size = 'medium',
  className,
}) => {
  const [showPreview, setShowPreview] = React.useState(false);
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

  // Unified delay display logic
  const getDelayDisplay = () => {
    if (!unit) {
      // Card in hand or deck - show base delay
      return data.delay > 0 ? { type: 'delay', value: data.delay } : null;
    }
    
    if (unit.position?.row === 'reinforcement') {
      // Unit in reinforcement row
      if (unit.turnsInReserve >= unit.delay) {
        return { type: 'ready', value: 0 };
      } else {
        const turnsLeft = unit.delay - unit.turnsInReserve;
        return { type: 'waiting', value: turnsLeft };
      }
    }
    
    // Unit on front line - no delay display needed
    return null;
  };

  const delayInfo = getDelayDisplay();

  if (isFaceDown && !showPreview) {
    return (
      <motion.div
        className={cn(
          'relative rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-lg cursor-pointer select-none',
          sizeClasses[size],
          isSelected && 'border-yellow-500',
          isHovered && 'border-gray-500',
          delayInfo?.type === 'ready' && 'border-green-500 border-[3px]',
          className
        )}
        onClick={onClick}
        onMouseEnter={() => {
          if (canPreview) {
            setShowPreview(true);
          }
          onHover?.();
        }}
        onMouseLeave={() => {
          setShowPreview(false);
          onHoverEnd?.();
        }}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Card Back Design */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className="w-8 h-8 text-gray-600 mb-2" />
          <div className="text-gray-400 font-bold text-lg">?</div>
        </div>
        
        {/* Unified Delay Display */}
        {delayInfo && delayInfo.type !== 'ready' && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 font-bold">{delayInfo.value}</span>
          </div>
        )}
        
        {/* Unit Type Indicator */}
        <div className="absolute top-2 left-2 text-xs text-gray-500 font-semibold">
          UNIT
        </div>
      </motion.div>
    );
  }

  return (
    <TooltipProvider delayDuration={750}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              'relative rounded-lg bg-gradient-to-br from-gray-900 to-black border-2 shadow-xl overflow-hidden cursor-pointer select-none',
              sizeClasses[size],
              isSelected && 'border-yellow-500',
              isHovered && 'border-blue-400',
              delayInfo?.type === 'ready' && 'border-green-500 border-[3px] animate-pulse',
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
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-2 py-1">
        <div className="flex justify-between items-center">
          {/* Left side: Health and Morale */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500" />
              <span className="text-white font-bold text-xs">
                {currentHealth}
                {unit && unit.currentHealth < unit.baseHealth && (
                  <span className="text-gray-400">/{unit.baseHealth}</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-blue-500" />
              <span className="text-white font-bold text-xs">
                {currentMorale}
                {unit && unit.currentMorale < unit.baseMorale && (
                  <span className="text-gray-400">/{unit.baseMorale}</span>
                )}
              </span>
            </div>
          </div>
          
          {/* Center: Power */}
          <div className="flex items-center gap-1">
            <span className={cn('font-bold text-base', getDamageTypeColor())}>
              {power}
            </span>
            {getDamageTypeIcon()}
          </div>
          
          {/* Right side: Space for delay indicator */}
          <div className="w-8">
            {/* This empty div reserves space for the delay indicator */}
          </div>
        </div>
      </div>

      {/* Unified Delay Display */}
      {delayInfo && delayInfo.type !== 'ready' && (
        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5">
          <Clock className="w-3 h-3 text-yellow-500" />
          <span className="text-yellow-500 font-bold text-sm">{delayInfo.value}</span>
        </div>
      )}
          </motion.div>
        </TooltipTrigger>
        {data.abilities.length > 0 && (
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-sm">{data.name}</h4>
              {data.abilities.map((ability, index) => (
                <div key={index} className="text-xs">
                  <span className="font-semibold capitalize">{ability.type} - {ability.name}:</span>
                  <p className="text-gray-300 mt-1">{ability.description}</p>
                </div>
              ))}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};