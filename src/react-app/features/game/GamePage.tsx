import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { GameBoard } from './components/GameBoard';
import { PlayerHand } from './components/PlayerHand';
import { PlayerInfo } from './components/PlayerInfo';
import { useGameStore } from '../../store/gameStore';
import { createGameState } from '../../../game/models/GameState';
import { createPlayer } from '../../../game/models/Player';
import { ASHEN_LEGION_CARDS } from '../../../game/data/ashen-legion-cards';
import { ASHEN_LEGION_COMMANDERS } from '../../../game/data/commanders';
import { Button } from '@/components/ui/button';
import { RotateCw, Check } from 'lucide-react';
import { toast } from 'sonner';
import { GameNavigation } from '../../components/GameNavigation';

export const GamePage: React.FC = () => {
  const {
    gameState,
    playerId,
    initializeGame,
    getCurrentPlayer,
    getOpponentPlayer,
    isMyTurn,
    processAction,
  } = useGameStore();

  // Initialize game for testing
  useEffect(() => {
    if (!gameState) {
      // Create test players with Ashen Legion decks
      const deck1 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
      const deck2 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
      
      const player1 = createPlayer(
        'player1',
        'Player 1',
        ASHEN_LEGION_COMMANDERS[0],
        deck1
      );
      
      const player2 = createPlayer(
        'player2',
        'Player 2',
        ASHEN_LEGION_COMMANDERS[1],
        deck2
      );
      
      const newGameState = createGameState('game1', player1, player2);
      initializeGame(newGameState, 'player1');
    }
  }, [gameState, initializeGame]);

  const currentPlayer = getCurrentPlayer();
  const opponentPlayer = getOpponentPlayer();

  if (!gameState || !currentPlayer || !opponentPlayer || !playerId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  const handleEndTurn = async () => {
    const success = await processAction({
      type: 'endTurn',
      playerId,
      data: {},
    });
    
    if (success) {
      toast.success('Turn ended');
    } else {
      toast.error('Cannot end turn yet');
    }
  };

  const handleDrawCard = async () => {
    const success = await processAction({
      type: 'drawCard',
      playerId,
      data: {},
    });
    
    if (success) {
      toast.success('Drew a card');
    } else {
      toast.error('Cannot draw card');
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <GameNavigation />
        <div className="container mx-auto p-4">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              The Will to Fight
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Turn {gameState.turn} - {gameState.phase} Phase
              </div>
              {gameState.status === 'finished' && gameState.winner && (
                <div className="text-lg font-bold text-yellow-500">
                  {gameState.winner === playerId ? 'Victory!' : 'Defeat'}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[300px_1fr_300px] gap-4">
            {/* Left Column - Current Player Info */}
            <div className="space-y-4">
              <PlayerInfo
                player={currentPlayer}
                isCurrentPlayer={true}
                isActivePlayer={gameState.players[gameState.currentPlayerIndex].id === currentPlayer.id}
              />
              
              {/* Action Buttons */}
              {isMyTurn() && (
                <div className="space-y-2">
                  <Button
                    onClick={handleDrawCard}
                    className="w-full"
                    variant="secondary"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Draw Card
                  </Button>
                  
                  <Button
                    onClick={handleEndTurn}
                    className="w-full"
                    variant="default"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    End Turn
                  </Button>
                </div>
              )}
            </div>

            {/* Center - Game Boards */}
            <div className="space-y-4">
              {/* Opponent Board */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GameBoard
                  isPlayerBoard={false}
                  frontLine={opponentPlayer.frontLine}
                  reinforcementRow={opponentPlayer.reinforcementRow}
                />
              </motion.div>

              {/* Combat Zone Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-yellow-600" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-4 text-yellow-600 font-bold">
                    COMBAT ZONE
                  </span>
                </div>
              </div>

              {/* Player Board */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GameBoard
                  isPlayerBoard={true}
                  frontLine={currentPlayer.frontLine}
                  reinforcementRow={currentPlayer.reinforcementRow}
                />
              </motion.div>
            </div>

            {/* Right Column - Opponent Info */}
            <div>
              <PlayerInfo
                player={opponentPlayer}
                isCurrentPlayer={false}
                isActivePlayer={gameState.players[gameState.currentPlayerIndex].id === opponentPlayer.id}
              />
            </div>
          </div>

          {/* Player Hand */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PlayerHand cards={currentPlayer.hand} />
          </motion.div>
        </div>
      </div>
    </DndProvider>
  );
};