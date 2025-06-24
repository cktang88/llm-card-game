import { Unit } from '../models/Unit';
import { Player } from '../models/Player';
import { GAME_CONSTANTS, POSITION_SLOTS } from '../constants';

export class BoardManager {
  static canPlayUnitToReinforcementRow(player: Player): boolean {
    return player.reinforcementRow.some(slot => slot === null);
  }

  static playUnitToReinforcementRow(player: Player, unit: Unit): boolean {
    const emptySlotIndex = player.reinforcementRow.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) return false;

    player.reinforcementRow[emptySlotIndex] = unit;
    unit.position = { row: 'reinforcement', slot: emptySlotIndex };
    unit.faceDown = true;
    return true;
  }

  static canDeployUnit(player: Player, reinforcementSlot: number): boolean {
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
  }

  static deployUnit(
    player: Player, 
    reinforcementSlot: number, 
    frontLineSlot?: number
  ): boolean {
    const unit = player.reinforcementRow[reinforcementSlot];
    if (!unit || !this.canDeployUnit(player, reinforcementSlot)) return false;

    // Clear from reinforcement row
    player.reinforcementRow[reinforcementSlot] = null;
    unit.faceDown = false;

    // If no specific slot provided, find appropriate slot
    if (frontLineSlot === undefined) {
      // First check for matching unit to reinforce
      const matchingUnitIndex = player.frontLine.findIndex(
        frontLineUnit => frontLineUnit && frontLineUnit.cardId === unit.cardId
      );
      
      if (matchingUnitIndex !== -1) {
        return this.reinforceUnit(player, unit, matchingUnitIndex);
      }
      
      // Otherwise find empty slot
      frontLineSlot = player.frontLine.findIndex(slot => slot === null);
      if (frontLineSlot === -1) return false;
    }

    // Check if we're reinforcing an existing unit
    const existingUnit = player.frontLine[frontLineSlot];
    if (existingUnit && existingUnit.cardId === unit.cardId) {
      return this.reinforceUnit(player, unit, frontLineSlot);
    }

    // Deploy to empty slot
    if (existingUnit === null) {
      player.frontLine[frontLineSlot] = unit;
      unit.position = { row: 'frontLine', slot: frontLineSlot };
      unit.turnsInReserve = 0;
      return true;
    }

    return false;
  }

  static reinforceUnit(player: Player, reinforcingUnit: Unit, frontLineSlot: number): boolean {
    const existingUnit = player.frontLine[frontLineSlot];
    if (!existingUnit || existingUnit.cardId !== reinforcingUnit.cardId) return false;

    // Merge health and morale, capped at base values
    existingUnit.currentHealth = Math.min(
      existingUnit.currentHealth + reinforcingUnit.currentHealth,
      existingUnit.baseHealth
    );
    
    existingUnit.currentMorale = Math.min(
      existingUnit.currentMorale + reinforcingUnit.currentMorale,
      existingUnit.baseMorale
    );

    return true;
  }

  static getAdjacentUnits(player: Player, slot: number): (Unit | null)[] {
    const adjacent: (Unit | null)[] = [];
    if (slot > 0) adjacent.push(player.frontLine[slot - 1]);
    if (slot < GAME_CONSTANTS.FRONT_LINE_SIZE - 1) adjacent.push(player.frontLine[slot + 1]);
    return adjacent;
  }

  static isInCenterPosition(slot: number): boolean {
    return POSITION_SLOTS.CENTER.includes(slot as any);
  }

  static isInFlankPosition(slot: number): boolean {
    return POSITION_SLOTS.FLANK.includes(slot as any);
  }

  static incrementTurnsInReserve(player: Player): void {
    player.reinforcementRow.forEach(unit => {
      if (unit) {
        unit.turnsInReserve++;
      }
    });
  }

  static removeDefeatedUnits(player: Player): Unit[] {
    const defeatedUnits: Unit[] = [];
    
    // Check front line
    player.frontLine = player.frontLine.map(unit => {
      if (unit && (unit.currentHealth <= 0 || unit.currentMorale <= 0)) {
        defeatedUnits.push(unit);
        return null;
      }
      return unit;
    });

    return defeatedUnits;
  }
}