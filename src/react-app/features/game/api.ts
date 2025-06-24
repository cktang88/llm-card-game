import { GameState, GameAction } from '../../../game/models/GameState';
import { Card } from '../../../game/models/Unit';
import { Commander } from '../../../game/models/Commander';

const API_BASE = '/api';

export interface CreateGameRequest {
  player1Name: string;
  player2Name: string;
  player1DeckId?: string;
  player2DeckId?: string;
}

export interface CreateGameResponse {
  success: boolean;
  gameId?: string;
  player1Id?: string;
  player2Id?: string;
  gameState?: GameState;
  error?: string;
}

export interface GetGameResponse {
  success: boolean;
  gameState?: GameState;
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
  async createGame(request: CreateGameRequest): Promise<CreateGameResponse> {
    try {
      const response = await fetch(`${API_BASE}/games`, {
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
        error: error instanceof Error ? error.message : 'Failed to create game',
      };
    }
  }

  async getGame(gameId: string): Promise<GetGameResponse> {
    try {
      const response = await fetch(`${API_BASE}/games/${gameId}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get game',
      };
    }
  }

  async processAction(
    gameId: string,
    action: Omit<GameAction, 'timestamp'>
  ): Promise<ProcessActionResponse> {
    try {
      const response = await fetch(`${API_BASE}/games/${gameId}/actions`, {
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