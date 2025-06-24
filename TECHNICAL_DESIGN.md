# The Will to Fight - Technical Design Document

## Overview

"The Will to Fight" is a two-player tactical card game focusing on morale-based combat mechanics. The game features strategic unit positioning, reinforcement mechanics, and a unique power system tied to unit morale.

## Architecture Overview

### Tech Stack

- **Frontend**: React with TypeScript for type safety
- **State Management**: Zustand for game state management
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Vite for fast development
- **Testing**: n/a
- **Game Logic**: Pure TypeScript classes for testability

### Core Components

#### 1. Data Models

```typescript
interface Unit {
  id: string;
  name: string;
  baseHealth: number;
  currentHealth: number;
  baseMorale: number;
  currentMorale: number;
  power: number; // Always equals currentMorale
  delay: number; // 0-4 turns
  damageType: "health" | "morale" | "both";
  abilities: Ability[];
  position?: BoardPosition;
  turnsInReserve: number;
}

interface Ability {
  id: string;
  name: string;
  type: "center" | "flank" | "synergy" | "passive" | "reinforcement";
  effect: AbilityEffect;
  condition?: AbilityCondition;
}

interface Player {
  id: string;
  name: string;
  overallArmyMorale: number;
  commander: Commander;
  deck: Card[];
  hand: Card[];
  frontLine: (Unit | null)[];
  reinforcementRow: (Unit | null)[];
}

interface GameState {
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  turn: number;
  phase: "play" | "deploy" | "commander" | "combat";
  winner: string | null;
}
```

#### 2. Game Flow Architecture

```
GameManager
├── TurnManager (handles turn phases)
├── BoardManager (manages unit positions)
├── CombatResolver (handles combat calculations)
├── AbilityProcessor (processes unit abilities)
├── MoraleTracker (tracks overall army morale)
└── WinConditionChecker (checks victory conditions)
```

#### 3. Key Systems

**Board System**

- 5 slots for Front Line (active units)
- 3 slots for Reinforcement Row (face-down units)
- Position-based ability activation

**Combat System**

- Column-based targeting (units attack opposing column)
- Damage calculation based on current morale (power)
- Two damage types: Health and Morale

**Morale System**

- Unit morale directly determines power
- Overall Army Morale as primary win condition
- Morale loss on unit defeat/rout

**Ability System**

- Position-dependent abilities (center, flank)
- Synergy abilities (adjacency bonuses)
- Passive and reinforcement abilities

## Implementation Phases

### Phase 1: Core Foundation

1. Set up project with React + TypeScript + Vite
2. Implement basic data models
3. Create board visualization components
4. Basic state management setup

### Phase 2: Game Mechanics

1. Turn system implementation
2. Unit placement and deployment
3. Combat resolution logic
4. Morale tracking system

### Phase 3: Advanced Features

1. All ability types implementation
2. Reinforcement/merging mechanics
3. Commander abilities with cooldowns
4. Win condition checking

### Phase 4: Polish & Testing

1. UI/UX improvements
2. Animation system
3. Sound effects
4. Comprehensive testing
5. Balance adjustments

### Phase 5: Multiplayer (Optional)

1. WebSocket integration
2. Room/lobby system
3. Spectator mode
4. Replay system

## Key Algorithms

### Power Calculation

```typescript
unit.power = unit.currentMorale; // Always synchronized
```

### Combat Resolution

```typescript
1. Determine target (opposing column unit)
2. Calculate damage based on attacker's power
3. Apply damage based on damage type
4. Check for defeat/rout conditions
5. Update Overall Army Morale if needed
```

### Ability Activation

```typescript
1. Check unit position
2. Verify ability conditions
3. Apply ability effects
4. Recalculate affected stats
```

## Testing Strategy

n/a

## Performance Considerations

n/a
