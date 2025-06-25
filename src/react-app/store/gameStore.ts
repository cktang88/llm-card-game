import { create } from 'zustand';
import { GameState, GameAction } from '../../game/models/GameState';
import { Card } from '../../game/models/Unit';
import { Player } from '../../game/models/Player';
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
  roomCode: string | null;
  gameId: string | null;
  playerId: string | null;
  gameMode: 'vs_ai' | 'multiplayer' | null;
  
  // UI state
  selectedCard: Card | null;
  hoveredCard: Card | null;
  draggedCard: DraggedCard | null;
  selectedReinforcementSlot: number | null;
  selectedFrontLineSlot: number | null;
  
  // Polling
  pollingInterval: NodeJS.Timeout | null;
  
  // Game actions
  loadRoom: (roomCode: string) => Promise<void>;
  processAction: (action: Omit<GameAction, 'timestamp'>) => Promise<boolean>;
  refreshGameState: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  clearGame: () => void;
  
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
  canPlayCard: () => boolean;
  canDeployUnit: (reinforcementSlot: number) => boolean;
  canUseCommander: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: null,
  roomCode: null,
  gameId: null,
  playerId: null,
  gameMode: null,
  selectedCard: null,
  hoveredCard: null,
  draggedCard: null,
  selectedReinforcementSlot: null,
  selectedFrontLineSlot: null,
  pollingInterval: null,
  
  // Game actions
  loadRoom: async (roomCode) => {
    const response = await gameApi.getRoom(roomCode);
    
    if (response.success && response.room) {
      const { room } = response;
      const playerId = sessionStorage.getItem('gamePlayerId');
      const gameMode = sessionStorage.getItem('gameMode') as 'vs_ai' | 'multiplayer';
      
      set({
        gameState: room.gameState,
        roomCode: room.roomCode,
        gameId: room.id,
        playerId,
        gameMode: gameMode || room.gameMode,
      });
      
      // Start polling for multiplayer games
      if (room.gameMode === 'multiplayer' && room.status === 'active') {
        get().startPolling();
      }
    } else {
      toast.error(response.error || 'Failed to load game');
      throw new Error(response.error || 'Failed to load game');
    }
  },
  
  processAction: async (action) => {
    const { roomCode, playerId } = get();
    
    if (!roomCode || !playerId) return false;
    
    const response = await gameApi.processAction(roomCode, action);
    
    if (response.success && response.gameState) {
      set({ gameState: response.gameState });
      return true;
    } else {
      toast.error(response.error || 'Action failed');
      return false;
    }
  },
  
  refreshGameState: async () => {
    const { roomCode } = get();
    
    if (!roomCode) return;
    
    const response = await gameApi.getRoom(roomCode);
    if (response.success && response.room) {
      const currentState = get().gameState;
      const newState = response.room.gameState;
      
      // Only update if state has changed
      if (JSON.stringify(currentState) !== JSON.stringify(newState)) {
        set({ gameState: newState });
      }
    }
  },
  
  startPolling: () => {
    const { pollingInterval } = get();
    
    // Clear existing interval if any
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Poll every 2 seconds
    const interval = setInterval(() => {
      get().refreshGameState();
    }, 2000);
    
    set({ pollingInterval: interval });
  },
  
  stopPolling: () => {
    const { pollingInterval } = get();
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },
  
  clearGame: () => {
    get().stopPolling();
    set({
      gameState: null,
      roomCode: null,
      gameId: null,
      playerId: null,
      gameMode: null,
      selectedCard: null,
      hoveredCard: null,
      draggedCard: null,
      selectedReinforcementSlot: null,
      selectedFrontLineSlot: null,
    });
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
  
  canPlayCard: () => {
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