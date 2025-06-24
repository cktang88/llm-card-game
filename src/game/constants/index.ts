export const GAME_CONSTANTS = {
  FRONT_LINE_SIZE: 5,
  REINFORCEMENT_ROW_SIZE: 3,
  MAX_DELAY: 4,
  STARTING_HAND_SIZE: 5,
  CARDS_DRAWN_PER_TURN: 1,
  DEFAULT_OVERALL_ARMY_MORALE: 50,
  MAX_DECK_SIZE: 30,
  MIN_DECK_SIZE: 20,
} as const;

export const POSITION_SLOTS = {
  CENTER: [2], // Middle slot (0-indexed)
  FLANK: [0, 4], // Leftmost and rightmost slots
} as const;

export const FACTION_NAMES = {
  NEUTRAL: 'Neutral',
  ASHEN_LEGION: 'Ashen Legion',
} as const;