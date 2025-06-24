import { Unit, getUnitPower } from '../models/Unit';
import { Player } from '../models/Player';
import { GameState } from '../models/GameState';

export interface CombatResult {
  attacker: Unit;
  defender: Unit | null;
  damage: number;
  damageType: 'health' | 'morale' | 'both';
  defeated: boolean;
}

export class CombatResolver {
  static resolveColumnCombat(
    attackingPlayer: Player,
    defendingPlayer: Player,
    columnIndex: number
  ): CombatResult | null {
    const attacker = attackingPlayer.frontLine[columnIndex];
    const defender = defendingPlayer.frontLine[columnIndex];

    if (!attacker) return null;

    const damage = getUnitPower(attacker);
    const result: CombatResult = {
      attacker,
      defender,
      damage,
      damageType: attacker.damageType,
      defeated: false,
    };

    if (!defender) {
      // No defender, damage goes to overall army morale
      this.damageOverallMorale(defendingPlayer, damage);
      return result;
    }

    // Apply damage based on type
    switch (attacker.damageType) {
      case 'health':
        defender.currentHealth -= damage;
        break;
      case 'morale':
        defender.currentMorale -= damage;
        break;
      case 'both':
        // Split damage between health and morale
        const halfDamage = Math.floor(damage / 2);
        defender.currentHealth -= halfDamage;
        defender.currentMorale -= damage - halfDamage;
        break;
    }

    // Check if defender is defeated
    if (defender.currentHealth <= 0 || defender.currentMorale <= 0) {
      result.defeated = true;
    }

    return result;
  }

  static resolveAllCombat(gameState: GameState): CombatResult[] {
    const results: CombatResult[] = [];
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const attackingPlayer = gameState.players[currentPlayerIndex];
    const defendingPlayer = gameState.players[currentPlayerIndex === 0 ? 1 : 0];

    // Resolve combat for each column
    for (let i = 0; i < attackingPlayer.frontLine.length; i++) {
      const result = this.resolveColumnCombat(attackingPlayer, defendingPlayer, i);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  static damageOverallMorale(player: Player, damage: number): void {
    player.overallArmyMorale = Math.max(0, player.overallArmyMorale - damage);
  }

  static handleDefeatedUnit(player: Player, unit: Unit): void {
    // When a unit is defeated or routed, damage overall morale by base morale value
    this.damageOverallMorale(player, unit.baseMorale);
  }

  static healOverallMorale(player: Player, amount: number): void {
    player.overallArmyMorale = Math.min(
      player.overallArmyMorale + amount,
      player.maxOverallArmyMorale
    );
  }
}