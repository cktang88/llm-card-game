import { Unit, Card } from './Unit';
import { Commander } from './Commander';

export interface Player {
  id: string;
  name: string;
  overallArmyMorale: number;
  maxOverallArmyMorale: number;
  commander: Commander;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  frontLine: (Unit | null)[];
  reinforcementRow: (Unit | null)[];
  hasPlayedUnitThisTurn: boolean;
  hasDeployedThisTurn: boolean;
  hasUsedCommanderThisTurn: boolean;
}

export function createPlayer(
  id: string,
  name: string,
  commander: Commander,
  deck: Card[],
  maxOverallArmyMorale: number = 50
): Player {
  return {
    id,
    name,
    overallArmyMorale: maxOverallArmyMorale,
    maxOverallArmyMorale,
    commander,
    deck: [...deck],
    hand: [],
    discardPile: [],
    frontLine: Array(5).fill(null),
    reinforcementRow: Array(3).fill(null),
    hasPlayedUnitThisTurn: false,
    hasDeployedThisTurn: false,
    hasUsedCommanderThisTurn: false,
  };
}

export function drawCards(player: Player, count: number): void {
  for (let i = 0; i < count; i++) {
    if (player.deck.length === 0) {
      player.deck = [...player.discardPile];
      player.discardPile = [];
      shuffleDeck(player.deck);
    }
    
    if (player.deck.length > 0) {
      const card = player.deck.pop()!;
      player.hand.push(card);
    }
  }
}

function shuffleDeck(deck: Card[]): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}