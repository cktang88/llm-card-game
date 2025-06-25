import { Player } from './Player';

export type GamePhase = 'play' | 'deploy' | 'commander' | 'combat' | 'end';
export type GameStatus = 'waiting' | 'active' | 'finished';

export interface GameState {
  id: string;
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  turn: number;
  phase: GamePhase;
  status: GameStatus;
  winner: string | null;
  lastAction?: GameAction;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameAction {
  type: 'playUnit' | 'deployUnit' | 'useCommander' | 'drawCard' | 'endTurn' | 'surrender' | 'mulligan';
  playerId: string;
  data: any;
  timestamp: Date;
}

export function createGameState(
  id: string,
  player1: Player,
  player2: Player
): GameState {
  return {
    id,
    players: [player1, player2],
    currentPlayerIndex: Math.random() < 0.5 ? 0 : 1,
    turn: 1,
    phase: 'play',
    status: 'active',
    winner: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function getCurrentPlayer(gameState: GameState): Player {
  return gameState.players[gameState.currentPlayerIndex];
}

export function getOpponentPlayer(gameState: GameState): Player {
  return gameState.players[gameState.currentPlayerIndex === 0 ? 1 : 0];
}

export function switchTurn(gameState: GameState): void {
  gameState.currentPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  gameState.turn++;
  gameState.phase = 'play';
  
  const currentPlayer = getCurrentPlayer(gameState);
  currentPlayer.hasPlayedUnitThisTurn = false;
  currentPlayer.hasUsedCommanderThisTurn = false;
}