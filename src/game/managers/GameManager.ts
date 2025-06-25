import { GameState, GameAction, getCurrentPlayer, getOpponentPlayer, switchTurn } from '../models/GameState';
import { Player, drawCards } from '../models/Player';
import { createUnitFromCard } from '../models/Unit';
import { tickCommanderCooldown, useCommanderAbility, canUseCommanderAbility } from '../models/Commander';
import { BoardManager } from './BoardManager';
import { CombatResolver } from './CombatResolver';
import { AbilityProcessor } from './AbilityProcessor';
import { GAME_CONSTANTS } from '../constants';
import { ASHEN_LEGION_CARDS } from '../data/ashen-legion-cards';

export class GameManager {
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  initializeGame(): void {
    // Draw starting hands
    this.gameState.players.forEach(player => {
      drawCards(player, GAME_CONSTANTS.STARTING_HAND_SIZE);
    });
  }

  processAction(action: GameAction): boolean {
    const currentPlayer = getCurrentPlayer(this.gameState);
    
    if (action.playerId !== currentPlayer.id) {
      return false; // Not the current player's turn
    }

    switch (action.type) {
      case 'playUnit':
        return this.playUnit(action.data.cardId);
      
      case 'deployUnit':
        return this.deployUnit(action.data.reinforcementSlot, action.data.frontLineSlot);
      
      case 'useCommander':
        return this.useCommanderAbility();
      
      case 'drawCard':
        return this.drawCard();
      
      case 'endTurn':
        return this.endTurn();
      
      case 'surrender':
        return this.surrender(action.playerId);
      
      case 'mulligan':
        return this.mulligan(action.playerId);
      
      default:
        return false;
    }
  }

  private playUnit(cardId: string): boolean {
    const currentPlayer = getCurrentPlayer(this.gameState);
    
    if (currentPlayer.hasPlayedUnitThisTurn) return false;
    if (!BoardManager.canPlayUnitToReinforcementRow(currentPlayer)) return false;

    const cardIndex = currentPlayer.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return false;

    const card = currentPlayer.hand[cardIndex];
    const unit = createUnitFromCard(card, currentPlayer.id);

    if (BoardManager.playUnitToReinforcementRow(currentPlayer, unit)) {
      currentPlayer.hand.splice(cardIndex, 1);
      currentPlayer.hasPlayedUnitThisTurn = true;
      this.gameState.updatedAt = new Date();
      return true;
    }

    return false;
  }

  private deployUnit(reinforcementSlot: number, frontLineSlot?: number): boolean {
    const currentPlayer = getCurrentPlayer(this.gameState);
    
    if (currentPlayer.hasDeployedThisTurn) return false;

    if (BoardManager.deployUnit(currentPlayer, reinforcementSlot, frontLineSlot)) {
      currentPlayer.hasDeployedThisTurn = true;
      this.gameState.updatedAt = new Date();
      return true;
    }

    return false;
  }

  private useCommanderAbility(): boolean {
    const currentPlayer = getCurrentPlayer(this.gameState);
    const opponent = getOpponentPlayer(this.gameState);
    
    if (currentPlayer.hasUsedCommanderThisTurn) return false;
    if (!canUseCommanderAbility(currentPlayer.commander)) return false;

    // Apply commander ability effect
    const ability = currentPlayer.commander.ability;
    this.applyCommanderAbilityEffect(ability, currentPlayer, opponent);
    
    useCommanderAbility(currentPlayer.commander);
    currentPlayer.hasUsedCommanderThisTurn = true;
    this.gameState.updatedAt = new Date();
    
    return true;
  }

  private applyCommanderAbilityEffect(
    ability: any,
    currentPlayer: Player,
    opponent: Player
  ): void {
    // This would be implemented based on specific commander abilities
    // For now, it's a placeholder
    switch (ability.effect.type) {
      case 'healMorale':
        CombatResolver.healOverallMorale(currentPlayer, ability.effect.value);
        break;
      case 'damageAll':
        opponent.frontLine.forEach(unit => {
          if (unit) {
            unit.currentHealth -= ability.effect.value;
          }
        });
        break;
      // Add more commander ability types as needed
    }
  }


  private drawCard(): boolean {
    const currentPlayer = getCurrentPlayer(this.gameState);
    drawCards(currentPlayer, GAME_CONSTANTS.CARDS_DRAWN_PER_TURN);
    this.gameState.updatedAt = new Date();
    return true;
  }

  private endTurn(): boolean {
    const currentPlayer = getCurrentPlayer(this.gameState);
    const opponent = getOpponentPlayer(this.gameState);

    // Process end of turn abilities
    AbilityProcessor.processUnitAbilities(currentPlayer, opponent);

    // Resolve combat
    CombatResolver.resolveAllCombat(this.gameState);
    
    // Handle defeated units and move them to discard pile
    const currentPlayerDefeated = BoardManager.removeDefeatedUnits(currentPlayer);
    const opponentDefeated = BoardManager.removeDefeatedUnits(opponent);
    
    currentPlayerDefeated.forEach(unit => {
      CombatResolver.handleDefeatedUnit(currentPlayer, unit);
      // Find the original card and move to discard pile
      const card = ASHEN_LEGION_CARDS.find(c => c.id === unit.cardId);
      if (card) {
        currentPlayer.discardPile.push(card);
      }
    });
    
    opponentDefeated.forEach(unit => {
      CombatResolver.handleDefeatedUnit(opponent, unit);
      // Find the original card and move to discard pile
      const card = ASHEN_LEGION_CARDS.find(c => c.id === unit.cardId);
      if (card) {
        opponent.discardPile.push(card);
      }
    });

    // Check win conditions
    if (this.checkWinConditions()) {
      return true;
    }

    // Switch to next player
    switchTurn(this.gameState);
    
    // Start of turn effects
    const newCurrentPlayer = getCurrentPlayer(this.gameState);
    
    // Increment turns in reserve for reinforcement units
    BoardManager.incrementTurnsInReserve(newCurrentPlayer);
    
    // Tick down commander cooldown
    tickCommanderCooldown(newCurrentPlayer.commander);
    
    // Draw card at start of turn
    drawCards(newCurrentPlayer, GAME_CONSTANTS.CARDS_DRAWN_PER_TURN);
    
    this.gameState.updatedAt = new Date();
    return true;
  }

  private checkWinConditions(): boolean {
    for (let i = 0; i < this.gameState.players.length; i++) {
      const player = this.gameState.players[i];
      const opponent = this.gameState.players[i === 0 ? 1 : 0];
      
      // Check if opponent's morale is 0
      if (opponent.overallArmyMorale <= 0) {
        this.gameState.winner = player.id;
        this.gameState.status = 'finished';
        return true;
      }
    }
    
    return false;
  }

  private surrender(playerId: string): boolean {
    const surrenderingPlayerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (surrenderingPlayerIndex === -1) return false;
    
    const winnerIndex = surrenderingPlayerIndex === 0 ? 1 : 0;
    this.gameState.winner = this.gameState.players[winnerIndex].id;
    this.gameState.status = 'finished';
    this.gameState.updatedAt = new Date();
    
    return true;
  }

  private mulligan(playerId: string): boolean {
    // Can only mulligan on turn 1
    if (this.gameState.turn !== 1) return false;
    
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;
    
    const player = this.gameState.players[playerIndex];
    
    // Check if player has already mulliganed (we'll track this with a flag)
    if ((player as any).hasMulliganed) return false;
    
    // Shuffle hand back into deck
    const currentHand = [...player.hand];
    player.deck.push(...currentHand);
    player.hand = [];
    
    // Shuffle the deck
    for (let i = player.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
    }
    
    // Draw 5 new cards
    drawCards(player, 5);
    
    // Mark that player has mulliganed
    (player as any).hasMulliganed = true;
    
    this.gameState.updatedAt = new Date();
    return true;
  }

  getGameState(): GameState {
    return this.gameState;
  }
}