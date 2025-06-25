This is a TCG game.

### **Game Overview: The Will to Fight**

- **Objective:** Reduce your opponent's **Overall Army Morale** to zero, or defeat their **Commander Unit**.
- **Game Flow:** A continuous, single battle without rounds. Players take turns playing cards and activating abilities until a win condition is met.
- NOTE: there is no "energy" system, just a delay stat on units.

---

### **Core Game Mechanics**

**0. Deck Building**

- Players can build their decks from the base cards.
- In the initial card draw, players draw 5 cards from their deck. They can choose to mulligan to get a new hand initially.

**1. Board Layout: Front Lines & Reinforcements**

- Each player has two rows:
  - **Front Line (Active Row):** Up to 5 units can be active here. These units engage in combat and use abilities.
  - **Reinforcement Row (Inactive Row):** Units are played face-down into this row, up to 3 cards can be active here.
- **Deployment:**
  - When you play a unit card, it goes face-down (hidden from opponent) into an empty slot in your **Reinforcement Row**.You can play up to one a turn.
  - Units each have a "delay" stat, which is how many turns (0-4) it must wait before being able to be deployed to any active front line slots. Usually more powerful units have a higher delay.
  - At the start of your turn, you may move any number of ready units from your Reinforcement Row forward to fill empty slots (or reinforce existing identical units, see the `Merging` section below) in your **Front Line**, flipping them face-up and becoming active. If the Front Line is full, units remain in the Reinforcement Row.

**2. Unit Anatomy: Power, Health, & Morale**

- Each unit has core stats:
  - **Health (H):** Represents the unit's physical durability.
  - **Morale (M):** Represents the unit's fighting spirit (starts at its base value), and also represents how much damage it can deal.
  - **Delay (D):** How many turns (0-4) it must wait before being able to be deployed to any active front line slots. Usually more powerful units have a higher delay.
- **Damage Types:**
  - Units will usually have one of the following damage types, some units have both.
  - **Health Damage (HD):** Reduces a unit's Health. If Health reaches 0, the unit is **Defeated**.
  - **Morale Damage (MD):** Reduces a unit's Morale. If Morale reaches 0, the unit **Routs**.
- **Ability Types:**
  - **Center Ability:** Active while the unit is in the middle slots of the Front Line, or when surrounded by specific unit types.
  - **Flank Ability:** Active while the unit is in the leftmost or rightmost slot of the Front Line.
  - **Synergy Ability:** Active when the unit is next to one or more specific unit types.
  - **Passive Ability:** Active when the unit is in the Front Line.
  - **Reinforcement Ability:** Active when the unit is in the Reinforcement Row.

**3. Overall Army Morale**

- Each player has a **Overall Army Morale Track** (e.g., 50 points). This is your primary "life total."
- **Morale Loss:**
  - When one of your units is **Defeated** (Health to 0), you lose **Overall Army Morale** equal to that unit's _original base Morale value_.
  - When one of your units **Routs** (Morale to 0), you lose **Overall Army Morale** equal to that unit's _original base Morale value_.
  - Some specific spell or unit abilities can deal direct **Morale Damage** to your **Overall Army Morale Track**.
- **Morale Gain:** Some spell or unit abilities can restore your **Overall Army Morale**.

**4. Unit Abilities & Positioning**

- Unit positioning and synergy is key, many have passive abilities that are only active when the unit is in a certain position.

**5. Reinforcing Units (Merging)**

- You can "reinforce" an existing unit on your **Front Line** by playing an _identical unit card_ from your hand onto that unit.
- **Effect:** The Morale and Health of the units merge, but cannot exceed their original base maximums.
  - _Example:_ A "Swordsman" at 5/10 Morale and 3/5 Health is reinforced by another "Swordsman" (base 10/10 Morale, 5/5 Health). The combined unit becomes 10/10 Morale (healing the previous Morale) and 5/5 Health (healing previous Health).
- **Benefit:** This heals the unit and prevents a morale hit to your **Overall Army Morale** if that unit would have been defeated/routed due to its low current stats. It also conserves precious Front Line slots.

**6. Combat & Action Flow**

- On their turn, players typically do the following (in order):
  1. Playing a unit card to your Reinforcement Row (limit one per turn).
  2. Moving any number of ready units from your Reinforcement Row to your Front Line.
  3. Using your Commander's ability (these are usually powerful abilities that are used sparingly, they have cooldowns).
  4. Draw a card from their deck. If it is exhausted, reshuffle discard pile into deck.
  5. Ends the turn.
- **Combat Resolution:** After actions, units engage. Attacks typically target opposing units in the same column unless abilities allow otherwise. Units deal damage equal to their current Power (Morale).
- When units are routed or defeated, they are moved to the discard pile. Some units might have a description of what happens to them when discarded (they might return to hand, or be destroyed permanently for the rest of the battle).
