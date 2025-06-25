import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { GameBoard } from './components/GameBoard';
import { PlayerHand } from './components/PlayerHand';
import { PlayerInfo } from './components/PlayerInfo';
import { GameCard } from './components/GameCard';
import { useGameStore } from '../../store/gameStore';
import { Button } from '@/components/ui/button';
import { Check, Copy, Users, Flag, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { GameNavigation } from '../../components/GameNavigation';
import { cn } from '@/lib/utils';

export const GamePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMulliganed, setHasMulliganed] = useState(false);
  const [showMulliganPrompt, setShowMulliganPrompt] = useState(false);
  
  const {
    gameState,
    roomCode,
    playerId,
    gameMode,
    loadRoom,
    getCurrentPlayer,
    getOpponentPlayer,
    isMyTurn,
    processAction,
    clearGame,
  } = useGameStore();

  // Get room code from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const roomCodeFromUrl = urlParams.get('room');

  // Load room on component mount
  useEffect(() => {
    const loadGame = async () => {
      if (!roomCodeFromUrl) {
        setError('No room code provided');
        setIsLoading(false);
        return;
      }

      try {
        await loadRoom(roomCodeFromUrl);
        setIsLoading(false);
        
        // Show mulligan prompt on first turn only
        const state = useGameStore.getState().gameState;
        if (state && state.turn === 1 && !hasMulliganed) {
          setShowMulliganPrompt(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game');
        setIsLoading(false);
      }
    };

    loadGame();

    // Cleanup on unmount
    return () => {
      clearGame();
    };
  }, [roomCodeFromUrl, loadRoom, clearGame]);

  const currentPlayer = getCurrentPlayer();
  const opponentPlayer = getOpponentPlayer();
  
  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success('Room code copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (!gameState || !currentPlayer || !opponentPlayer || !playerId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Waiting for game data...</div>
      </div>
    );
  }
  
  // Show waiting screen for multiplayer if opponent hasn't joined
  if (gameMode === 'multiplayer' && opponentPlayer.id === 'waiting-for-player') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Waiting for opponent...</h2>
          <p className="mb-6">Share this room code with your friend:</p>
          <div className="bg-gray-800 rounded-lg p-4 inline-flex items-center gap-2">
            <span className="text-3xl font-mono">{roomCode}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyRoomCode}
              className="hover:bg-gray-700"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </div>
        </div>
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

  const handleConcede = async () => {
    if (!confirm('Are you sure you want to concede? This will end the game.')) {
      return;
    }
    
    const success = await processAction({
      type: 'surrender',
      playerId,
      data: {},
    });
    
    if (success) {
      toast.success('You have conceded the match');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      toast.error('Failed to concede');
    }
  };

  const handleMulligan = async () => {
    const success = await processAction({
      type: 'mulligan',
      playerId,
      data: {},
    });
    
    if (success) {
      toast.success('Hand shuffled and redrawn!');
      setHasMulliganed(true);
      setShowMulliganPrompt(false);
    } else {
      toast.error('Cannot mulligan');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col game-container">
        <GameNavigation />
        <div className="flex-1 flex flex-col p-4">
          {/* Mulligan Prompt */}
          {showMulliganPrompt && gameState && gameState.turn === 1 && currentPlayer && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-gray-800 p-6 rounded-lg max-w-4xl">
                <h2 className="text-xl font-bold mb-4">Mulligan Initial Hand?</h2>
                <p className="text-gray-300 mb-4">
                  You can shuffle your starting hand back into your deck and draw 5 new cards. 
                  You can only do this once at the start of the game.
                </p>
                
                {/* Display current hand */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Your Current Hand:</h3>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {currentPlayer.hand.map((card) => (
                      <div key={card.id} className="transition-transform hover:scale-105">
                        <GameCard
                          card={card}
                          size="medium"
                          className="shadow-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleMulligan}
                    variant="default"
                    className="flex-1"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Mulligan
                  </Button>
                  <Button
                    onClick={() => {
                      setShowMulliganPrompt(false);
                      setHasMulliganed(true);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Keep Hand
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Game Header */}
          <div className="mb-1 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold">Room: {roomCode}</h2>
              {gameMode === 'multiplayer' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyRoomCode}
                  className="h-7 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {gameMode === 'vs_ai' ? 'Playing vs AI' : 'Multiplayer'}
            </div>
          </div>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              The Will to Fight
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Turn {gameState.turn} - {gameState.phase} Phase
              </div>
              <div className={cn(
                "px-3 py-1 rounded font-bold text-sm",
                isMyTurn() 
                  ? "bg-green-600 text-white animate-pulse" 
                  : "bg-gray-700 text-gray-300"
              )}>
                {isMyTurn() ? "Your Turn" : "Opponent's Turn"}
              </div>
              {gameState.status === 'finished' && gameState.winner && (
                <div className="text-lg font-bold text-yellow-500">
                  {gameState.winner === playerId ? 'Victory!' : 'Defeat'}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[260px_1fr] gap-4 min-h-[600px]">
            {/* Left Column - Player Info */}
            <div className="flex flex-col justify-between">
              {/* Opponent Info - Top */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PlayerInfo
                  player={opponentPlayer}
                  isCurrentPlayer={false}
                  isActivePlayer={gameState.players[gameState.currentPlayerIndex].id === opponentPlayer.id}
                />
              </motion.div>

              {/* Action Buttons - Middle */}
              <div className="flex-1 flex items-center">
                <div className="w-full space-y-2 px-4">
                  {isMyTurn() && (
                    <Button
                      onClick={handleEndTurn}
                      className="w-full"
                      variant="default"
                      size="lg"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      End Turn
                    </Button>
                  )}
                  <Button
                    onClick={handleConcede}
                    className="w-full"
                    variant="destructive"
                    size="sm"
                  >
                    <Flag className="w-3 h-3 mr-2" />
                    Concede
                  </Button>
                </div>
              </div>

              {/* Current Player Info - Bottom */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <PlayerInfo
                  player={currentPlayer}
                  isCurrentPlayer={true}
                  isActivePlayer={gameState.players[gameState.currentPlayerIndex].id === currentPlayer.id}
                />
              </motion.div>
            </div>

            {/* Right Column - Game Boards */}
            <div className="flex flex-col h-full">
              {/* Opponent Board */}
              <motion.div
                className="flex-1"
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
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-yellow-600" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-2 text-yellow-600 font-bold text-sm">
                    COMBAT ZONE
                  </span>
                </div>
              </div>

              {/* Player Board */}
              <motion.div
                className="flex-1"
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
          </div>

          {/* Player Hand */}
          <motion.div
            className="mt-2 pb-4"
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