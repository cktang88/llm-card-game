import { Unit, Ability } from '../models/Unit';
import { Player } from '../models/Player';
import { BoardManager } from './BoardManager';
import { CombatResolver } from './CombatResolver';

export class AbilityProcessor {
  static processUnitAbilities(player: Player, opponent: Player): void {
    // Process front line abilities
    player.frontLine.forEach((unit, slot) => {
      if (unit) {
        unit.abilities.forEach(ability => {
          if (this.checkAbilityCondition(ability, unit, player, slot)) {
            this.applyAbilityEffect(ability, unit, player, opponent, slot);
          }
        });
      }
    });

    // Process reinforcement row abilities
    player.reinforcementRow.forEach((unit, slot) => {
      if (unit) {
        unit.abilities
          .filter(ability => ability.type === 'reinforcement')
          .forEach(ability => {
            this.applyAbilityEffect(ability, unit, player, opponent, slot);
          });
      }
    });
  }

  private static checkAbilityCondition(
    ability: Ability,
    unit: Unit,
    player: Player,
    slot: number
  ): boolean {
    // Check ability type conditions
    switch (ability.type) {
      case 'center':
        return BoardManager.isInCenterPosition(slot);
      
      case 'flank':
        return BoardManager.isInFlankPosition(slot);
      
      case 'synergy':
        const adjacentUnits = BoardManager.getAdjacentUnits(player, slot);
        return adjacentUnits.some(adjacent => {
          if (!adjacent || !ability.condition) return false;
          if (ability.condition.type === 'unitType') {
            return adjacent.name === ability.condition.value;
          }
          return true;
        });
      
      case 'passive':
        return unit.position?.row === 'frontLine';
      
      case 'reinforcement':
        return unit.position?.row === 'reinforcement';
      
      default:
        return true;
    }
  }

  private static applyAbilityEffect(
    ability: Ability,
    unit: Unit,
    player: Player,
    opponent: Player,
    slot: number
  ): void {
    const { effect } = ability;
    
    switch (effect.type) {
      case 'buff':
        this.applyBuff(effect, unit, player, slot);
        break;
      
      case 'damage':
        this.applyDamage(effect, unit, player, opponent, slot);
        break;
      
      case 'heal':
        this.applyHeal(effect, unit, player, slot);
        break;
      
      case 'moraleBoost':
        this.applyMoraleBoost(effect, unit, player);
        break;
      
      case 'draw':
        // This would be handled by game manager
        break;
      
      case 'special':
        // Handle special abilities case by case
        break;
    }
  }

  private static applyBuff(
    effect: any,
    unit: Unit,
    player: Player,
    slot: number
  ): void {
    const targets = this.getTargets(effect.target, unit, player, null, slot);
    targets.forEach(target => {
      if (target) {
        // Apply buff based on effect value
        if (typeof effect.value === 'number') {
          target.currentMorale += effect.value;
          target.currentMorale = Math.min(target.currentMorale, target.baseMorale);
        }
      }
    });
  }

  private static applyDamage(
    effect: any,
    unit: Unit,
    player: Player,
    opponent: Player,
    slot: number
  ): void {
    const targets = this.getTargets(effect.target, unit, player, opponent, slot);
    targets.forEach(target => {
      if (target && typeof effect.value === 'number') {
        target.currentHealth -= effect.value;
      }
    });
  }

  private static applyHeal(
    effect: any,
    unit: Unit,
    player: Player,
    slot: number
  ): void {
    const targets = this.getTargets(effect.target, unit, player, null, slot);
    targets.forEach(target => {
      if (target && typeof effect.value === 'number') {
        target.currentHealth = Math.min(
          target.currentHealth + effect.value,
          target.baseHealth
        );
      }
    });
  }

  private static applyMoraleBoost(
    effect: any,
    _unit: Unit,
    player: Player
  ): void {
    if (effect.target === 'player' && typeof effect.value === 'number') {
      CombatResolver.healOverallMorale(player, effect.value);
    }
  }

  private static getTargets(
    targetType: string,
    unit: Unit,
    player: Player,
    opponent: Player | null,
    slot: number
  ): (Unit | null)[] {
    switch (targetType) {
      case 'self':
        return [unit];
      
      case 'adjacent':
        return BoardManager.getAdjacentUnits(player, slot);
      
      case 'allFriendly':
        return player.frontLine.filter(u => u !== null);
      
      case 'allEnemy':
        return opponent ? opponent.frontLine.filter(u => u !== null) : [];
      
      case 'enemy':
        // Target enemy in same column
        return opponent && opponent.frontLine[slot] ? [opponent.frontLine[slot]] : [];
      
      default:
        return [];
    }
  }
}