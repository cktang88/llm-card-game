import { Commander, createCommander } from '../models/Commander';

export const ASHEN_LEGION_COMMANDERS: Commander[] = [
  createCommander(
    'cmd-al-001',
    'General Pyrrhus the Undying',
    'Ashen Legion',
    {
      id: 'cmd-al-001-ability',
      name: 'Phoenix Resurrection',
      description: 'Resurrect the last destroyed friendly unit with full Health/Morale',
      cooldown: 3,
      effect: {
        type: 'resurrect_last',
        value: {
          fullStats: true,
          targetRow: 'reinforcement'
        }
      }
    }
  ),
  createCommander(
    'cmd-al-002',
    'Marshal Cindara',
    'Ashen Legion',
    {
      id: 'cmd-al-002-ability',
      name: 'Ash Storm',
      description: 'All enemy units take 2 Morale damage and lose 1 Health',
      cooldown: 4,
      effect: {
        type: 'damage_all_enemies',
        value: {
          moraleDamage: 2,
          healthDamage: 1
        }
      }
    }
  ),
  createCommander(
    'cmd-al-003',
    'Lord Ignus the Eternal',
    'Ashen Legion',
    {
      id: 'cmd-al-003-ability',
      name: 'Rally from Ashes',
      description: 'Restore 5 Overall Army Morale and all units gain +2 Morale',
      cooldown: 5,
      effect: {
        type: 'rally',
        value: {
          armyMoraleRestore: 5,
          unitMoraleBoost: 2
        }
      }
    }
  )
];

export function getAshenLegionCommanderById(id: string): Commander | undefined {
  return ASHEN_LEGION_COMMANDERS.find(commander => commander.id === id);
}