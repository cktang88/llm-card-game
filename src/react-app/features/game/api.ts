import { GameState, GameAction } from '../../../game/models/GameState';
import { Card } from '../../../game/models/Unit';
import { Commander } from '../../../game/models/Commander';

const API_BASE = '/api';

export interface CreateRoomRequest {
  playerName: string;
  gameMode: 'vs_ai' | 'multiplayer';
}

export interface CreateRoomResponse {
  success: boolean;
  roomCode?: string;
  gameId?: string;
  playerId?: string;
  gameState?: GameState;
  error?: string;
}

export interface JoinRoomRequest {
  playerName: string;
}

export interface JoinRoomResponse {
  success: boolean;
  roomCode?: string;
  gameId?: string;
  playerId?: string;
  gameState?: GameState;
  error?: string;
}

export interface GetRoomResponse {
  success: boolean;
  room?: {
    id: string;
    roomCode: string;
    gameMode: 'vs_ai' | 'multiplayer';
    status: 'waiting' | 'active' | 'completed';
    player1Id: string | null;
    player2Id: string | null;
    gameState: GameState;
  };
  error?: string;
}

export interface ProcessActionResponse {
  success: boolean;
  gameState?: GameState;
  error?: string;
}

export interface GetCardsResponse {
  success: boolean;
  cards?: Card[];
  commanders?: Commander[];
  error?: string;
}

class GameApi {
  async createRoom(request: CreateRoomRequest): Promise<CreateRoomResponse> {
    try {
      const response = await fetch(`${API_BASE}/games/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room',
      };
    }
  }

  async joinRoom(roomCode: string, request: JoinRoomRequest): Promise<JoinRoomResponse> {
    try {
      const response = await fetch(`${API_BASE}/games/room/${roomCode}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room',
      };
    }
  }

  async getRoom(roomCode: string): Promise<GetRoomResponse> {
    try {
      const response = await fetch(`${API_BASE}/games/room/${roomCode}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get room',
      };
    }
  }

  async processAction(
    roomCode: string,
    action: Omit<GameAction, 'timestamp'>
  ): Promise<ProcessActionResponse> {
    try {
      const response = await fetch(`${API_BASE}/games/room/${roomCode}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action),
      });
      
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process action',
      };
    }
  }

  async getCards(faction?: string): Promise<GetCardsResponse> {
    try {
      const url = faction 
        ? `${API_BASE}/cards/${faction}`
        : `${API_BASE}/cards`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get cards',
      };
    }
  }
}

export const gameApi = new GameApi();