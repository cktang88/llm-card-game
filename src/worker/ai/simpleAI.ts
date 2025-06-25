import { GameState, GameAction } from "../../game/models/GameState";
import { Unit } from "../../game/models/Unit";

export class SimpleAI {
  /**
   * Simple AI that makes basic decisions
   */
  static makeDecision(gameState: GameState, aiPlayerId: string): GameAction | null {
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = gameState.players[currentPlayerIndex];
    
    // Only make decisions if it's the AI's turn
    if (currentPlayer.id !== aiPlayerId) {
      console.log(`[AI] Not AI's turn. Current player: ${currentPlayer.id}, AI player: ${aiPlayerId}`);
      return null;
    }

    // Based on current phase, make appropriate decision
    switch (gameState.phase) {
      case 'play':
        return this.makePlayPhaseDecision(gameState, aiPlayerId);
      case 'deploy':
        return this.makeDeployPhaseDecision(gameState, aiPlayerId);
      case 'commander':
        // Skip commander phase for now
        return {
          type: 'endTurn',
          playerId: aiPlayerId,
          data: {},
          timestamp: new Date()
        };
      case 'combat':
        // Combat is automatic, just end turn
        return {
          type: 'endTurn',
          playerId: aiPlayerId,
          data: {},
          timestamp: new Date()
        };
      default:
        return {
          type: 'endTurn',
          playerId: aiPlayerId,
          data: {},
          timestamp: new Date()
        };
    }
  }

  private static makePlayPhaseDecision(gameState: GameState, aiPlayerId: string): GameAction {
    const aiPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Try to play a unit from hand
    if (aiPlayer.hand.length > 0) {
      const availableSlots = this.getAvailableReinforcementSlots(aiPlayer.reinforcementRow);
      
      if (availableSlots.length > 0) {
        // Play the first unit that has 0 delay (can be played immediately)
        const playableCard = aiPlayer.hand.find(card => card.delay === 0);
        
        if (playableCard) {
          return {
            type: 'playUnit',
            playerId: aiPlayerId,
            data: {
              unitId: playableCard.id,
              position: availableSlots[0]
            },
            timestamp: new Date()
          };
        }
      }
    }
    
    // If can't play a unit but have card slots, draw a card
    if (aiPlayer.deck.length > 0 && aiPlayer.hand.length < 7) {
      return {
        type: 'drawCard',
        playerId: aiPlayerId,
        data: {},
        timestamp: new Date()
      };
    }
    
    // If hand is full or deck is empty, end turn
    return {
      type: 'endTurn',
      playerId: aiPlayerId,
      data: {},
      timestamp: new Date()
    };
  }

  private static makeDeployPhaseDecision(gameState: GameState, aiPlayerId: string): GameAction {
    const aiPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Find units in reinforcement row that are ready (turnsInReserve > 0)
    const readyUnits: { unit: Unit; index: number }[] = [];
    aiPlayer.reinforcementRow.forEach((unit, index) => {
      if (unit && unit.turnsInReserve > 0) {
        readyUnits.push({ unit, index });
      }
    });
    
    if (readyUnits.length > 0) {
      // Find available front line positions
      const availableFrontSlots = this.getAvailableFrontLineSlots(aiPlayer.frontLine);
      
      if (availableFrontSlots.length > 0) {
        // Deploy the first ready unit to the first available slot
        const unitToDeploy = readyUnits[0];
        return {
          type: 'deployUnit',
          playerId: aiPlayerId,
          data: {
            unitId: unitToDeploy.unit.id,
            fromPosition: unitToDeploy.index,
            toPosition: availableFrontSlots[0]
          },
          timestamp: new Date()
        };
      }
    }
    
    // No units to deploy, end turn
    return {
      type: 'endTurn',
      playerId: aiPlayerId,
      data: {},
      timestamp: new Date()
    };
  }

  private static getAvailableReinforcementSlots(reinforcementRow: (Unit | null)[]): number[] {
    const slots: number[] = [];
    reinforcementRow.forEach((unit, index) => {
      if (!unit) {
        slots.push(index);
      }
    });
    return slots;
  }

  private static getAvailableFrontLineSlots(frontLine: (Unit | null)[]): number[] {
    const slots: number[] = [];
    frontLine.forEach((unit, index) => {
      if (!unit) {
        slots.push(index);
      }
    });
    return slots;
  }
}