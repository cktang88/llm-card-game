import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../../../game/models/Player';
import { cn } from '@/lib/utils';
import { Brain, Shield, Swords, Clock, Zap } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
  isActivePlayer: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  isCurrentPlayer,
  isActivePlayer,
}) => {
  const { processAction, playerId, canUseCommander } = useGameStore();

  const handleUseCommander = () => {
    if (!playerId || !isCurrentPlayer || !canUseCommander()) return;
    
    processAction({
      type: 'useCommander',
      playerId,
      data: {},
    });
  };

  const moralePercentage = (player.overallArmyMorale / player.maxOverallArmyMorale) * 100;
  const moraleColor = moralePercentage > 50 ? 'bg-green-500' : moralePercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <motion.div
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        isActivePlayer ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 bg-gray-800/50',
        isCurrentPlayer && 'border-blue-500'
      )}
      initial={{ opacity: 0, x: isCurrentPlayer ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Player Name and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCurrentPlayer ? (
            <Shield className="w-5 h-5 text-blue-500" />
          ) : (
            <Swords className="w-5 h-5 text-red-500" />
          )}
          <h2 className="text-lg font-bold text-white">{player.name}</h2>
        </div>
        {isActivePlayer && (
          <motion.div
            className="text-sm font-semibold text-yellow-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Active Turn
          </motion.div>
        )}
      </div>

      {/* Overall Army Morale */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-300">Army Morale</span>
          </div>
          <span className="text-sm font-bold text-white">
            {player.overallArmyMorale} / {player.maxOverallArmyMorale}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className={cn('h-full transition-all', moraleColor)}
            initial={{ width: 0 }}
            animate={{ width: `${moralePercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Commander */}
      <div className="bg-gray-900/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-300">Commander</h3>
          <span className="text-xs text-gray-500">{player.commander.faction}</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-white font-medium">{player.commander.name}</div>
          
          {/* Commander Ability */}
          <div className="bg-gray-800 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-purple-400">
                {player.commander.ability.name}
              </span>
              {player.commander.ability.currentCooldown > 0 ? (
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-500">
                    {player.commander.ability.currentCooldown} turns
                  </span>
                </div>
              ) : (
                <Zap className="w-4 h-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-400">
              {player.commander.ability.description}
            </p>
            
            {isCurrentPlayer && (
              <motion.button
                className={cn(
                  'mt-2 w-full py-1 px-2 rounded text-sm font-medium transition-all',
                  canUseCommander()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                )}
                onClick={handleUseCommander}
                disabled={!canUseCommander()}
                whileHover={canUseCommander() ? { scale: 1.05 } : {}}
                whileTap={canUseCommander() ? { scale: 0.95 } : {}}
              >
                {player.commander.ability.currentCooldown > 0
                  ? `Cooldown: ${player.commander.ability.currentCooldown}`
                  : player.hasUsedCommanderThisTurn
                  ? 'Already Used'
                  : 'Use Ability'}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-gray-500">Deck</div>
          <div className="font-bold text-white">{player.deck.length}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Hand</div>
          <div className="font-bold text-white">{player.hand.length}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Discard</div>
          <div className="font-bold text-white">{player.discardPile.length}</div>
        </div>
      </div>
    </motion.div>
  );
};