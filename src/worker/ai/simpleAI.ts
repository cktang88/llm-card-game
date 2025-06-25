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

    const aiPlayer = currentPlayer;
    
    // Priority order:
    // 1. Play units from hand if we haven't already
    // 2. Deploy ready units to front line
    // 3. End turn

    // Check if we can play a unit from hand
    if (!aiPlayer.hasPlayedUnitThisTurn && aiPlayer.hand.length > 0) {
      const availableSlots = this.getAvailableReinforcementSlots(aiPlayer.reinforcementRow);
      
      if (availableSlots.length > 0) {
        // Find a card to play (prefer lower delay cards)
        const sortedCards = [...aiPlayer.hand].sort((a, b) => a.delay - b.delay);
        const cardToPlay = sortedCards[0];
        
        console.log(`[AI] Playing card ${cardToPlay.name} with delay ${cardToPlay.delay}`);
        
        return {
          type: 'playUnit',
          playerId: aiPlayerId,
          data: {
            cardId: cardToPlay.id
          },
          timestamp: new Date()
        };
      }
    }
    
    // Check if we can deploy units from reinforcement to front line
    const readyUnits: { unit: Unit; index: number }[] = [];
    aiPlayer.reinforcementRow.forEach((unit, index) => {
      if (unit && unit.turnsInReserve >= unit.delay) {
        readyUnits.push({ unit, index });
      }
    });
    
    if (readyUnits.length > 0) {
      const availableFrontSlots = this.getAvailableFrontLineSlots(aiPlayer.frontLine);
      
      if (availableFrontSlots.length > 0) {
        // Deploy the first ready unit to the best available position
        // Prioritize center (slot 2), then flanks closer to center
        const prioritySlots = [2, 1, 3, 0, 4];
        const unitToDeploy = readyUnits[0];
        
        for (const slot of prioritySlots) {
          if (availableFrontSlots.includes(slot)) {
            console.log(`[AI] Deploying unit ${unitToDeploy.unit.name} to front line slot ${slot}`);
            
            return {
              type: 'deployUnit',
              playerId: aiPlayerId,
              data: {
                reinforcementSlot: unitToDeploy.index,
                frontLineSlot: slot
              },
              timestamp: new Date()
            };
          }
        }
      }
    }
    
    // Nothing else to do, end turn
    console.log('[AI] Ending turn');
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