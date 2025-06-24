import { Hono } from "hono";
import { validator } from "hono/validator";
import { createGameState } from "../game/models/GameState";
import { createPlayer } from "../game/models/Player";
import { GameManager } from "../game/managers/GameManager";
import { ASHEN_LEGION_CARDS } from "../game/data/ashen-legion-cards";
import { ASHEN_LEGION_COMMANDERS } from "../game/data/commanders";

// In-memory game storage (will be replaced with Durable Objects for production)
const games = new Map<string, GameManager>();

const gameApi = new Hono();

// GET /api/games/:id - Get game state
gameApi.get("/games/:id", (c) => {
  const gameId = c.req.param("id");
  const gameManager = games.get(gameId);
  
  if (!gameManager) {
    return c.json({ success: false, error: "Game not found" }, 404);
  }
  
  return c.json({ 
    success: true, 
    gameState: gameManager.getGameState() 
  });
});

// POST /api/games - Create a new game
gameApi.post(
  "/games",
  validator("json", (value, c) => {
    const { player1Name, player2Name, player1DeckId, player2DeckId } = value as any;
    
    if (!player1Name || !player2Name) {
      return c.json({
        success: false,
        error: "Player names are required"
      }, 400);
    }
    
    return { 
      body: { 
        player1Name, 
        player2Name, 
        player1DeckId: player1DeckId || "default",
        player2DeckId: player2DeckId || "default"
      } 
    };
  }),
  async (c) => {
    const { player1Name, player2Name } = c.req.valid("json").body;
    
    // For now, use default Ashen Legion decks
    const deck1 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
    const deck2 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
    
    // Shuffle decks
    for (let i = deck1.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck1[i], deck1[j]] = [deck1[j], deck1[i]];
    }
    for (let i = deck2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck2[i], deck2[j]] = [deck2[j], deck2[i]];
    }
    
    const player1 = createPlayer(
      `player-${Date.now()}-1`,
      player1Name,
      ASHEN_LEGION_COMMANDERS[0],
      deck1
    );
    
    const player2 = createPlayer(
      `player-${Date.now()}-2`,
      player2Name,
      ASHEN_LEGION_COMMANDERS[1],
      deck2
    );
    
    const gameId = `game-${Date.now()}`;
    const gameState = createGameState(gameId, player1, player2);
    const gameManager = new GameManager(gameState);
    gameManager.initializeGame();
    
    games.set(gameId, gameManager);
    
    return c.json({
      success: true,
      gameId,
      player1Id: player1.id,
      player2Id: player2.id,
      gameState: gameManager.getGameState()
    }, 201);
  }
);

// POST /api/games/:id/actions - Process a game action
gameApi.post(
  "/games/:id/actions",
  validator("json", (value, c) => {
    const { type, playerId, data } = value as any;
    
    const validActions = ['playUnit', 'deployUnit', 'useCommander', 'drawCard', 'endTurn', 'surrender'];
    if (!validActions.includes(type)) {
      return c.json({
        success: false,
        error: "Invalid action type"
      }, 400);
    }
    
    if (!playerId) {
      return c.json({
        success: false,
        error: "Player ID is required"
      }, 400);
    }
    
    return { body: { type, playerId, data: data || {} } };
  }),
  async (c) => {
    const gameId = c.req.param("id");
    const { type, playerId, data } = c.req.valid("json").body;
    
    const gameManager = games.get(gameId);
    if (!gameManager) {
      return c.json({ success: false, error: "Game not found" }, 404);
    }
    
    const success = gameManager.processAction({
      type: type as any,
      playerId,
      data,
      timestamp: new Date()
    });
    
    if (success) {
      return c.json({
        success: true,
        gameState: gameManager.getGameState()
      });
    } else {
      return c.json({
        success: false,
        error: "Invalid action or not allowed at this time"
      }, 400);
    }
  }
);

// GET /api/cards - Get all available cards
gameApi.get("/cards", (c) => {
  return c.json({
    success: true,
    cards: ASHEN_LEGION_CARDS,
    commanders: ASHEN_LEGION_COMMANDERS
  });
});

// GET /api/cards/:faction - Get cards for a specific faction
gameApi.get("/cards/:faction", (c) => {
  const faction = c.req.param("faction");
  
  if (faction.toLowerCase() === "ashen-legion" || faction.toLowerCase() === "ashen_legion") {
    return c.json({
      success: true,
      cards: ASHEN_LEGION_CARDS,
      commanders: ASHEN_LEGION_COMMANDERS
    });
  }
  
  return c.json({
    success: false,
    error: "Faction not found"
  }, 404);
});

export default gameApi;