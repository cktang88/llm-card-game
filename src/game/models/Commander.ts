export interface CommanderAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  effect: {
    type: string;
    value: any;
  };
}

export interface Commander {
  id: string;
  name: string;
  faction: string;
  ability: CommanderAbility;
  imageUrl?: string;
}

export function createCommander(
  id: string,
  name: string,
  faction: string,
  ability: Omit<CommanderAbility, 'currentCooldown'>
): Commander {
  return {
    id,
    name,
    faction,
    ability: {
      ...ability,
      currentCooldown: 0,
    },
  };
}

export function canUseCommanderAbility(commander: Commander): boolean {
  return commander.ability.currentCooldown === 0;
}

export function useCommanderAbility(commander: Commander): void {
  if (canUseCommanderAbility(commander)) {
    commander.ability.currentCooldown = commander.ability.cooldown;
  }
}

export function tickCommanderCooldown(commander: Commander): void {
  if (commander.ability.currentCooldown > 0) {
    commander.ability.currentCooldown--;
  }
}