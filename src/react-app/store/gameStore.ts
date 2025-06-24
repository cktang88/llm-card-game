import { create } from 'zustand';
import { GameState, GameAction } from '../../game/models/GameState';
import { Card } from '../../game/models/Unit';
import { Player } from '../../game/models/Player';
import { GameManager } from '../../game/managers/GameManager';
import { gameApi } from '../features/game/api';
import { toast } from 'sonner';

interface DraggedCard {
  card: Card;
  sourceIndex: number;
  sourceType: 'hand' | 'reinforcement';
}

interface GameStore {
  // Game state
  gameState: GameState | null;
  gameManager: GameManager | null;
  gameId: string | null;
  playerId: string | null;
  isOnline: boolean;
  
  // UI state
  selectedCard: Card | null;
  hoveredCard: Card | null;
  draggedCard: DraggedCard | null;
  selectedReinforcementSlot: number | null;
  selectedFrontLineSlot: number | null;
  
  // Game actions
  initializeGame: (gameState: GameState, playerId: string) => void;
  createOnlineGame: (player1Name: string, player2Name: string) => Promise<void>;
  joinOnlineGame: (gameId: string, playerId: string) => Promise<void>;
  processAction: (action: Omit<GameAction, 'timestamp'>) => Promise<boolean>;
  refreshGameState: () => Promise<void>;
  
  // UI actions
  selectCard: (card: Card | null) => void;
  hoverCard: (card: Card | null) => void;
  setDraggedCard: (draggedCard: DraggedCard | null) => void;
  selectReinforcementSlot: (slot: number | null) => void;
  selectFrontLineSlot: (slot: number | null) => void;
  
  // Helper getters
  getCurrentPlayer: () => Player | null;
  getOpponentPlayer: () => Player | null;
  isMyTurn: () => boolean;
  canPlayCard: (card: Card) => boolean;
  canDeployUnit: (reinforcementSlot: number) => boolean;
  canUseCommander: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  gameManager: null,
  gameId: null,
  playerId: null,
  isOnline: false,
  selectedCard: null,
  hoveredCard: null,
  draggedCard: null,
  selectedReinforcementSlot: null,
  selectedFrontLineSlot: null,
  
  // Game actions
  initializeGame: (gameState, playerId) => {
    const gameManager = new GameManager(gameState);
    gameManager.initializeGame();
    set({ gameState, gameManager, playerId, isOnline: false });
  },
  
  createOnlineGame: async (player1Name, player2Name) => {
    const response = await gameApi.createGame({
      player1Name,
      player2Name,
    });
    
    if (response.success && response.gameState && response.gameId && response.player1Id) {
      set({
        gameState: response.gameState,
        gameId: response.gameId,
        playerId: response.player1Id,
        isOnline: true,
        gameManager: null, // Don't use local game manager for online games
      });
      toast.success('Game created successfully!');
    } else {
      toast.error(response.error || 'Failed to create game');
    }
  },
  
  joinOnlineGame: async (gameId, playerId) => {
    const response = await gameApi.getGame(gameId);
    
    if (response.success && response.gameState) {
      set({
        gameState: response.gameState,
        gameId,
        playerId,
        isOnline: true,
        gameManager: null,
      });
      toast.success('Joined game successfully!');
    } else {
      toast.error(response.error || 'Failed to join game');
    }
  },
  
  processAction: async (action) => {
    const { gameManager, gameId, playerId, isOnline } = get();
    
    if (!playerId) return false;
    
    if (isOnline && gameId) {
      // Online game - send to server
      const response = await gameApi.processAction(gameId, action);
      
      if (response.success && response.gameState) {
        set({ gameState: response.gameState });
        return true;
      } else {
        toast.error(response.error || 'Action failed');
        return false;
      }
    } else if (gameManager) {
      // Local game
      const fullAction: GameAction = {
        ...action,
        timestamp: new Date(),
      };
      
      const success = gameManager.processAction(fullAction);
      if (success) {
        set({ gameState: gameManager.getGameState() });
      }
      return success;
    }
    
    return false;
  },
  
  refreshGameState: async () => {
    const { gameId, isOnline } = get();
    
    if (!isOnline || !gameId) return;
    
    const response = await gameApi.getGame(gameId);
    if (response.success && response.gameState) {
      set({ gameState: response.gameState });
    }
  },
  
  // UI actions
  selectCard: (card) => set({ selectedCard: card }),
  hoverCard: (card) => set({ hoveredCard: card }),
  setDraggedCard: (draggedCard) => set({ draggedCard }),
  selectReinforcementSlot: (slot) => set({ selectedReinforcementSlot: slot }),
  selectFrontLineSlot: (slot) => set({ selectedFrontLineSlot: slot }),
  
  // Helper getters
  getCurrentPlayer: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return null;
    return gameState.players.find(p => p.id === playerId) || null;
  },
  
  getOpponentPlayer: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return null;
    return gameState.players.find(p => p.id !== playerId) || null;
  },
  
  isMyTurn: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return false;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    return currentPlayer.id === playerId;
  },
  
  canPlayCard: (_card) => {
    const { gameState, playerId, isMyTurn } = get();
    if (!gameState || !playerId || !isMyTurn()) return false;
    
    const player = get().getCurrentPlayer();
    if (!player) return false;
    
    // Check if player has already played a unit this turn
    if (player.hasPlayedUnitThisTurn) return false;
    
    // Check if there's space in reinforcement row
    return player.reinforcementRow.some(slot => slot === null);
  },
  
  canDeployUnit: (reinforcementSlot) => {
    const { gameState, playerId, isMyTurn } = get();
    if (!gameState || !playerId || !isMyTurn()) return false;
    
    const player = get().getCurrentPlayer();
    if (!player) return false;
    
    // Check if player has already deployed this turn
    if (player.hasDeployedThisTurn) return false;
    
    const unit = player.reinforcementRow[reinforcementSlot];
    if (!unit) return false;
    
    // Check if unit has waited enough turns
    if (unit.turnsInReserve < unit.delay) return false;
    
    // Check if there's space in front line or a matching unit to reinforce
    const hasEmptyFrontLineSlot = player.frontLine.some(slot => slot === null);
    const hasMatchingUnit = player.frontLine.some(
      frontLineUnit => frontLineUnit && frontLineUnit.cardId === unit.cardId
    );
    
    return hasEmptyFrontLineSlot || hasMatchingUnit;
  },
  
  canUseCommander: () => {
    const { gameState, playerId, isMyTurn } = get();
    if (!gameState || !playerId || !isMyTurn()) return false;
    
    const player = get().getCurrentPlayer();
    if (!player) return false;
    
    // Check if player has already used commander this turn
    if (player.hasUsedCommanderThisTurn) return false;
    
    // Check if commander ability is off cooldown
    return player.commander.ability.currentCooldown === 0;
  },
}));