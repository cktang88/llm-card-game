import { Card } from '../models/Unit';

export const ASHEN_LEGION_CARDS: Card[] = [
  // Common Cards (12)
  {
    id: 'al-001',
    name: 'Cindermarch Footman',
    faction: 'Ashen Legion',
    baseHealth: 5,
    baseMorale: 3,
    delay: 0,
    damageType: 'health',
    abilities: [
      {
        id: 'al-001-a1',
        name: 'From the Ashes',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'self',
          value: 1,
          description: '+1 Morale for each defeated allied unit this turn'
        },
        description: 'Gains +1 Morale for each allied unit defeated this turn'
      }
    ],
    description: 'The first to march, the last to fall.',
    imageUrl: ''
  },
  {
    id: 'al-002',
    name: 'Ember Scout',
    faction: 'Ashen Legion',
    baseHealth: 2,
    baseMorale: 4,
    delay: 0,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-002-a1',
        name: 'Ash Trail',
        type: 'flank',
        effect: {
          type: 'buff',
          target: 'adjacent',
          value: 1,
          description: 'Adjacent units gain +1 Morale'
        },
        description: 'While on a flank: Adjacent units gain +1 Morale'
      }
    ],
    description: 'Swift as smoke, deadly as flame.',
    imageUrl: ''
  },
  {
    id: 'al-003',
    name: 'Soot Stalker',
    faction: 'Ashen Legion',
    baseHealth: 3,
    baseMorale: 3,
    delay: 1,
    damageType: 'both',
    abilities: [
      {
        id: 'al-003-a1',
        name: 'Hidden in Ash',
        type: 'reinforcement',
        effect: {
          type: 'special',
          target: 'self',
          value: 'stealth',
          description: 'Cannot be targeted by abilities while in Reinforcement Row'
        },
        description: 'Cannot be targeted while in Reinforcement Row'
      }
    ],
    description: 'In ash and shadow, death awaits.',
    imageUrl: ''
  },
  {
    id: 'al-004',
    name: 'Cinder Surgeon',
    faction: 'Ashen Legion',
    baseHealth: 4,
    baseMorale: 2,
    delay: 1,
    damageType: 'health',
    abilities: [
      {
        id: 'al-004-a1',
        name: 'Battlefield Triage',
        type: 'passive',
        effect: {
          type: 'heal',
          target: 'adjacent',
          value: 1,
          description: 'At turn end, heal adjacent units 1 Health'
        },
        description: 'At turn end: Heal adjacent units 1 Health'
      }
    ],
    description: 'Mending the broken, preserving the damned.',
    imageUrl: ''
  },
  {
    id: 'al-005',
    name: 'Ash Prophet',
    faction: 'Ashen Legion',
    baseHealth: 3,
    baseMorale: 5,
    delay: 2,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-005-a1',
        name: 'Prophecy of Rebirth',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'player',
          value: 'morale_on_death',
          description: 'When an allied unit is defeated, restore 2 Overall Army Morale'
        },
        description: 'When an allied unit is defeated: Restore 2 Overall Army Morale'
      }
    ],
    description: 'Death is but a doorway to greater service.',
    imageUrl: ''
  },
  {
    id: 'al-006',
    name: 'Molten Shield Bearer',
    faction: 'Ashen Legion',
    baseHealth: 7,
    baseMorale: 2,
    delay: 1,
    damageType: 'health',
    abilities: [
      {
        id: 'al-006-a1',
        name: 'Molten Aegis',
        type: 'synergy',
        effect: {
          type: 'buff',
          target: 'adjacent',
          value: 2,
          description: 'Adjacent Shield Bearers grant +2 Health to all adjacent units'
        },
        condition: {
          type: 'unitType',
          value: 'Molten Shield Bearer'
        },
        description: 'Next to Shield Bearer: Adjacent units gain +2 Health'
      }
    ],
    description: 'A wall of fire and steel.',
    imageUrl: ''
  },
  {
    id: 'al-007',
    name: 'Ember Reaper',
    faction: 'Ashen Legion',
    baseHealth: 4,
    baseMorale: 6,
    delay: 2,
    damageType: 'both',
    abilities: [
      {
        id: 'al-007-a1',
        name: 'Death Burst',
        type: 'passive',
        effect: {
          type: 'damage',
          target: 'allEnemy',
          value: 2,
          description: 'When defeated: Deal 2 damage to all enemy units'
        },
        description: 'When defeated: Deal 2 damage to all enemy units'
      }
    ],
    description: 'In death, devastation.',
    imageUrl: ''
  },
  {
    id: 'al-008',
    name: 'Coal Heart Veteran',
    faction: 'Ashen Legion',
    baseHealth: 5,
    baseMorale: 4,
    delay: 1,
    damageType: 'health',
    abilities: [
      {
        id: 'al-008-a1',
        name: 'Survivor\'s Resolve',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'self',
          value: 2,
          description: 'Gain +2 Morale if any unit was defeated last turn'
        },
        description: 'If any unit was defeated last turn: Gain +2 Morale'
      }
    ],
    description: 'Each scar tells a story of survival.',
    imageUrl: ''
  },
  {
    id: 'al-009',
    name: 'Pyre Warden',
    faction: 'Ashen Legion',
    baseHealth: 3,
    baseMorale: 4,
    delay: 2,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-009-a1',
        name: 'Artillery Barrage',
        type: 'passive',
        effect: {
          type: 'damage',
          target: 'enemy',
          value: 1,
          description: 'Deal 1 Morale damage to enemy in same column each turn'
        },
        description: 'Each turn: Deal 1 Morale damage to enemy in same column'
      }
    ],
    description: 'Raining fire from afar.',
    imageUrl: ''
  },
  {
    id: 'al-010',
    name: 'Charred Conscript',
    faction: 'Ashen Legion',
    baseHealth: 3,
    baseMorale: 3,
    delay: 0,
    damageType: 'health',
    abilities: [
      {
        id: 'al-010-a1',
        name: 'Expendable',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'player',
          value: 'no_morale_loss',
          description: 'When defeated, lose no Overall Army Morale'
        },
        description: 'When defeated: Your Overall Army Morale is not reduced'
      }
    ],
    description: 'Fodder for the eternal flame.',
    imageUrl: ''
  },
  {
    id: 'al-011',
    name: 'Forge Master',
    faction: 'Ashen Legion',
    baseHealth: 6,
    baseMorale: 3,
    delay: 2,
    damageType: 'health',
    abilities: [
      {
        id: 'al-011-a1',
        name: 'Reforge the Fallen',
        type: 'synergy',
        effect: {
          type: 'heal',
          target: 'adjacent',
          value: 1,
          description: 'Adjacent damaged units heal 1 Health each turn'
        },
        condition: {
          type: 'always'
        },
        description: 'Adjacent damaged units heal 1 Health each turn'
      }
    ],
    description: 'From broken steel, new strength.',
    imageUrl: ''
  },
  {
    id: 'al-012',
    name: 'Smoke Dancer',
    faction: 'Ashen Legion',
    baseHealth: 2,
    baseMorale: 5,
    delay: 1,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-012-a1',
        name: 'Elusive',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'damage_reduction',
          description: 'Take 1 less damage from all sources'
        },
        description: 'Takes 1 less damage from all sources (minimum 1)'
      }
    ],
    description: 'Now you see me, now you burn.',
    imageUrl: ''
  },

  // Uncommon Cards (8)
  {
    id: 'al-013',
    name: 'Ashguard Phalanx',
    faction: 'Ashen Legion',
    baseHealth: 8,
    baseMorale: 4,
    delay: 2,
    damageType: 'health',
    abilities: [
      {
        id: 'al-013-a1',
        name: 'Undying Formation',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'resurrect_once',
          description: 'First time defeated, return with half Health/Morale'
        },
        description: 'First time defeated: Return with half Health/Morale (rounded down)'
      }
    ],
    description: 'Death holds no dominion here.',
    imageUrl: ''
  },
  {
    id: 'al-014',
    name: 'Pyroclast Knight',
    faction: 'Ashen Legion',
    baseHealth: 6,
    baseMorale: 7,
    delay: 3,
    damageType: 'both',
    abilities: [
      {
        id: 'al-014-a1',
        name: 'Trail of Fire',
        type: 'passive',
        effect: {
          type: 'moraleBoost',
          target: 'allFriendly',
          value: 1,
          description: 'All friendly units gain +1 Morale when deployed'
        },
        description: 'When deployed: All friendly units gain +1 Morale'
      }
    ],
    description: 'Where they ride, hope follows.',
    imageUrl: ''
  },
  {
    id: 'al-015',
    name: 'Immolation Zealot',
    faction: 'Ashen Legion',
    baseHealth: 4,
    baseMorale: 8,
    delay: 2,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-015-a1',
        name: 'Burning Fury',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'self',
          value: 3,
          description: 'Gain +3 Morale when below half Health'
        },
        description: 'While below half Health: +3 Morale'
      },
      {
        id: 'al-015-a2',
        name: 'Reckless',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'self_damage',
          description: 'Take 1 Health damage at end of your turn'
        },
        description: 'End of your turn: Take 1 Health damage'
      }
    ],
    description: 'Pain is fuel, suffering is strength.',
    imageUrl: ''
  },
  {
    id: 'al-016',
    name: 'Phoenix Guard',
    faction: 'Ashen Legion',
    baseHealth: 5,
    baseMorale: 6,
    delay: 3,
    damageType: 'both',
    abilities: [
      {
        id: 'al-016-a1',
        name: 'Rise Again',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'resurrect_stronger',
          description: 'When defeated, return next turn with +2/+2'
        },
        description: 'When defeated: Return next turn with +2 Health/+2 Morale (once per game)'
      }
    ],
    description: 'From death\'s embrace, reborn in flame.',
    imageUrl: ''
  },
  {
    id: 'al-017',
    name: 'Ember Sage',
    faction: 'Ashen Legion',
    baseHealth: 3,
    baseMorale: 7,
    delay: 3,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-017-a1',
        name: 'Wisdom of Ashes',
        type: 'passive',
        effect: {
          type: 'draw',
          target: 'player',
          value: 1,
          description: 'Draw a card when an allied unit is defeated'
        },
        description: 'When an allied unit is defeated: Draw a card'
      },
      {
        id: 'al-017-a2',
        name: 'Protective Wards',
        type: 'reinforcement',
        effect: {
          type: 'special',
          target: 'allFriendly',
          value: 'morale_shield',
          description: 'Front line units cannot have Morale reduced below 1'
        },
        description: 'While in Reinforcement: Front line units cannot have Morale reduced below 1'
      }
    ],
    description: 'Knowledge burns eternal.',
    imageUrl: ''
  },
  {
    id: 'al-018',
    name: 'Crucible Knight',
    faction: 'Ashen Legion',
    baseHealth: 7,
    baseMorale: 5,
    delay: 2,
    damageType: 'health',
    abilities: [
      {
        id: 'al-018-a1',
        name: 'Tempered in Battle',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'self',
          value: 1,
          description: 'Gain +1 Health when dealing damage'
        },
        description: 'After dealing damage: Gain +1 Health (max +3)'
      },
      {
        id: 'al-018-a2',
        name: 'Guardian Stance',
        type: 'flank',
        effect: {
          type: 'special',
          target: 'adjacent',
          value: 'redirect',
          description: 'Redirect attacks from adjacent allies to self'
        },
        description: 'While on flank: Take damage instead of adjacent allies'
      }
    ],
    description: 'Forged in war, cooled in blood.',
    imageUrl: ''
  },
  {
    id: 'al-019',
    name: 'Mourning Banshee',
    faction: 'Ashen Legion',
    baseHealth: 4,
    baseMorale: 6,
    delay: 2,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-019-a1',
        name: 'Wail of Sorrow',
        type: 'passive',
        effect: {
          type: 'damage',
          target: 'allEnemy',
          value: 1,
          description: 'When ally defeated: All enemies lose 1 Morale'
        },
        description: 'When an allied unit is defeated: All enemy units lose 1 Morale'
      }
    ],
    description: 'Her cries herald the fallen.',
    imageUrl: ''
  },
  {
    id: 'al-020',
    name: 'Ashfall Harbinger',
    faction: 'Ashen Legion',
    baseHealth: 5,
    baseMorale: 5,
    delay: 3,
    damageType: 'both',
    abilities: [
      {
        id: 'al-020-a1',
        name: 'Herald of Destruction',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'allFriendly',
          value: 1,
          description: 'Units gain +1 to all damage dealt'
        },
        description: 'All friendly units deal +1 damage'
      },
      {
        id: 'al-020-a2',
        name: 'Ominous Presence',
        type: 'reinforcement',
        effect: {
          type: 'damage',
          target: 'allEnemy',
          value: 1,
          description: 'Enemy units lose 1 Morale each turn'
        },
        description: 'While in Reinforcement: Enemy units lose 1 Morale each turn'
      }
    ],
    description: 'The sky weeps ash at his approach.',
    imageUrl: ''
  },

  // Rare Cards (5)
  {
    id: 'al-021',
    name: 'The Burned Marshal',
    faction: 'Ashen Legion',
    baseHealth: 8,
    baseMorale: 8,
    delay: 4,
    damageType: 'both',
    abilities: [
      {
        id: 'al-021-a1',
        name: 'Share the Burden',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'allFriendly',
          value: 'damage_redistribution',
          description: 'Distribute damage among all friendly units'
        },
        description: 'Damage to friendly units is distributed evenly among all units'
      },
      {
        id: 'al-021-a2',
        name: 'Inspiring Sacrifice',
        type: 'passive',
        effect: {
          type: 'moraleBoost',
          target: 'player',
          value: 5,
          description: 'When defeated: Restore 5 Overall Army Morale'
        },
        description: 'When defeated: Restore 5 Overall Army Morale'
      }
    ],
    description: 'His scars are legion, his will unbroken.',
    imageUrl: ''
  },
  {
    id: 'al-022',
    name: 'Avatar of the Final Flame',
    faction: 'Ashen Legion',
    baseHealth: 10,
    baseMorale: 10,
    delay: 4,
    damageType: 'both',
    abilities: [
      {
        id: 'al-022-a1',
        name: 'Fueled by Death',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'self',
          value: 1,
          description: 'Gain +1/+1 for each unit defeated this game'
        },
        description: 'Has +1 Health/+1 Morale for each unit defeated this game (both sides)'
      }
    ],
    description: 'The culmination of a thousand deaths.',
    imageUrl: ''
  },
  {
    id: 'al-023',
    name: 'Phoenix Guard Captain',
    faction: 'Ashen Legion',
    baseHealth: 6,
    baseMorale: 9,
    delay: 3,
    damageType: 'both',
    abilities: [
      {
        id: 'al-023-a1',
        name: 'Rally the Ashes',
        type: 'center',
        effect: {
          type: 'moraleBoost',
          target: 'player',
          value: 1,
          description: 'Restore 1 Overall Army Morale each turn'
        },
        description: 'While in center: Restore 1 Overall Army Morale each turn'
      },
      {
        id: 'al-023-a2',
        name: 'Phoenix Rebirth',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'resurrect_and_buff',
          description: 'Resurrect with full stats and buff allies'
        },
        description: 'When defeated: Return with full Health/Morale and all allies gain +2 Morale'
      }
    ],
    description: 'Leading from beyond death itself.',
    imageUrl: ''
  },
  {
    id: 'al-024',
    name: 'The Mourning Choir',
    faction: 'Ashen Legion',
    baseHealth: 5,
    baseMorale: 8,
    delay: 4,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-024-a1',
        name: 'Dirge of the Fallen',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'player',
          value: 'morale_conversion',
          description: 'Convert enemy Morale loss to your Morale gain'
        },
        description: 'When enemy units lose Morale: Gain that much Overall Army Morale'
      },
      {
        id: 'al-024-a2',
        name: 'Spectral Presence',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'immune_health',
          description: 'Immune to Health damage'
        },
        description: 'Cannot take Health damage'
      }
    ],
    description: 'Their song turns grief to power.',
    imageUrl: ''
  },
  {
    id: 'al-025',
    name: 'Cinder Lord',
    faction: 'Ashen Legion',
    baseHealth: 7,
    baseMorale: 7,
    delay: 3,
    damageType: 'both',
    abilities: [
      {
        id: 'al-025-a1',
        name: 'Lord of Ashes',
        type: 'passive',
        effect: {
          type: 'buff',
          target: 'allFriendly',
          value: 2,
          description: 'All units gain +2 Morale'
        },
        description: 'All friendly units have +2 Morale'
      },
      {
        id: 'al-025-a2',
        name: 'Immolation Aura',
        type: 'passive',
        effect: {
          type: 'damage',
          target: 'adjacent',
          value: 1,
          description: 'Deal 1 damage to adjacent enemies each turn'
        },
        description: 'Each turn: Deal 1 damage to adjacent enemy units'
      }
    ],
    description: 'Nobility forged in the furnace of war.',
    imageUrl: ''
  },

  // Legendary Cards (3)
  {
    id: 'al-026',
    name: 'Ignis, the Eternal Flame',
    faction: 'Ashen Legion',
    baseHealth: 12,
    baseMorale: 12,
    delay: 4,
    damageType: 'both',
    abilities: [
      {
        id: 'al-026-a1',
        name: 'Phoenix Lord',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'self',
          value: 'infinite_resurrect',
          description: 'Resurrect with -2/-2 each time (min 1/1)'
        },
        description: 'When defeated: Return next turn with -2 Health/-2 Morale (minimum 1/1)'
      },
      {
        id: 'al-026-a2',
        name: 'Conflagration',
        type: 'center',
        effect: {
          type: 'damage',
          target: 'allEnemy',
          value: 2,
          description: 'Deal 2 damage to all enemies each turn'
        },
        description: 'While in center: Deal 2 damage to all enemy units each turn'
      },
      {
        id: 'al-026-a3',
        name: 'Eternal Inspiration',
        type: 'passive',
        effect: {
          type: 'moraleBoost',
          target: 'player',
          value: 3,
          description: 'Restore 3 Overall Army Morale when resurrected'
        },
        description: 'When resurrected: Restore 3 Overall Army Morale'
      }
    ],
    description: 'The first flame that refuses to die.',
    imageUrl: ''
  },
  {
    id: 'al-027',
    name: 'The Crucible of War',
    faction: 'Ashen Legion',
    baseHealth: 15,
    baseMorale: 5,
    delay: 4,
    damageType: 'health',
    abilities: [
      {
        id: 'al-027-a1',
        name: 'Living Fortress',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'allFriendly',
          value: 'damage_reduction_2',
          description: 'All allies take 2 less damage'
        },
        description: 'All friendly units take 2 less damage (minimum 1)'
      },
      {
        id: 'al-027-a2',
        name: 'Forge of Heroes',
        type: 'center',
        effect: {
          type: 'special',
          target: 'adjacent',
          value: 'transform',
          description: 'Transform adjacent units into Phoenix Guards'
        },
        description: 'While in center: Adjacent units become Phoenix Guards when they would be defeated'
      }
    ],
    description: 'A monument to eternal conflict.',
    imageUrl: ''
  },
  {
    id: 'al-028',
    name: 'Ashara, Flame of Revolution',
    faction: 'Ashen Legion',
    baseHealth: 8,
    baseMorale: 10,
    delay: 3,
    damageType: 'morale',
    abilities: [
      {
        id: 'al-028-a1',
        name: 'Revolutionary Fervor',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'allFriendly',
          value: 'no_rout',
          description: 'Friendly units cannot have Morale reduced to 0'
        },
        description: 'Friendly units cannot Rout (minimum 1 Morale)'
      },
      {
        id: 'al-028-a2',
        name: 'Uprising',
        type: 'flank',
        effect: {
          type: 'special',
          target: 'player',
          value: 'double_morale_gain',
          description: 'Double all Overall Army Morale gains'
        },
        description: 'While on flank: Double all Overall Army Morale restoration'
      },
      {
        id: 'al-028-a3',
        name: 'Martyr\'s End',
        type: 'passive',
        effect: {
          type: 'special',
          target: 'allFriendly',
          value: 'mass_buff_on_death',
          description: 'When defeated: All units gain +3/+3'
        },
        description: 'When defeated: All friendly units gain +3 Health/+3 Morale'
      }
    ],
    description: 'From her sacrifice, a new dawn rises.',
    imageUrl: ''
  }
];

export function getAshenLegionCardById(id: string): Card | undefined {
  return ASHEN_LEGION_CARDS.find(card => card.id === id);
}

export function getAshenLegionCardsByRarity(rarity: 'common' | 'uncommon' | 'rare' | 'legendary'): Card[] {
  const rarityRanges = {
    common: [0, 11],
    uncommon: [12, 19],
    rare: [20, 24],
    legendary: [25, 27]
  };
  
  const [start, end] = rarityRanges[rarity];
  return ASHEN_LEGION_CARDS.slice(start, end + 1);
}