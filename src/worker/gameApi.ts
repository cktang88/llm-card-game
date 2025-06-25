import { Hono } from "hono";
import { validator } from "hono/validator";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { createGameState } from "../game/models/GameState";
import { createPlayer } from "../game/models/Player";
import { GameManager } from "../game/managers/GameManager";
import { ASHEN_LEGION_CARDS } from "../game/data/ashen-legion-cards";
import { ASHEN_LEGION_COMMANDERS } from "../game/data/commanders";
import { gameRooms as gameRoomsTable } from "./db/schema";
import { SimpleAI } from "./ai/simpleAI";

// Environment bindings
type Env = {
  DB: D1Database;
};

const gameApi = new Hono<{ Bindings: Env }>();

// Helper function to generate 6-digit alphabetic room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper function to process AI turn
async function processAITurn(gameManager: GameManager, aiPlayerId: string): Promise<void> {
  console.log('[AI] Starting AI turn processing');
  let actionCount = 0;
  const maxActions = 10; // Prevent infinite loops
  
  // Add small delay to simulate thinking
  await new Promise(resolve => setTimeout(resolve, 500));
  
  while (actionCount < maxActions) {
    const gameState = gameManager.getGameState();
    
    // Check if it's still AI's turn
    if (gameState.players[gameState.currentPlayerIndex].id !== aiPlayerId) {
      console.log('[AI] No longer AI turn, stopping');
      break;
    }
    
    const aiPlayer = gameState.players[gameState.currentPlayerIndex];
    console.log(`[AI] Turn ${gameState.turn}, Hand: ${aiPlayer.hand.length} cards, Deck: ${aiPlayer.deck.length} cards`);
    console.log(`[AI] Reinforcement slots: ${aiPlayer.reinforcementRow.map(u => u ? u.name : 'empty').join(', ')}`);
    console.log(`[AI] Front line slots: ${aiPlayer.frontLine.map(u => u ? u.name : 'empty').join(', ')}`);
    
    // Get AI decision
    const action = SimpleAI.makeDecision(gameState, aiPlayerId);
    if (!action) {
      console.log('[AI] No action decided, stopping');
      break;
    }
    
    console.log(`[AI] Attempting action: ${action.type}`, action.data);
    
    // Process the action
    const success = gameManager.processAction(action);
    if (!success) {
      console.log(`[AI] Action failed: ${action.type}`);
      // If we can't do anything else, end turn
      const endTurnAction = {
        type: 'endTurn' as const,
        playerId: aiPlayerId,
        data: {},
        timestamp: new Date()
      };
      const endTurnSuccess = gameManager.processAction(endTurnAction);
      console.log(`[AI] Forced end turn: ${endTurnSuccess}`);
      break;
    }
    
    console.log(`[AI] Action successful: ${action.type}`);
    
    // If action was endTurn, we're done
    if (action.type === 'endTurn') {
      console.log('[AI] Turn ended');
      break;
    }
    
    // Small delay between actions
    await new Promise(resolve => setTimeout(resolve, 300));
    
    actionCount++;
  }
  
  console.log(`[AI] Turn processing complete. Actions taken: ${actionCount}`);
}

// GET /api/games/room/:roomCode - Get game by room code
gameApi.get("/games/room/:roomCode", async (c) => {
  const roomCode = c.req.param("roomCode").toUpperCase();
  const db = drizzle(c.env.DB, { schema: { gameRoomsTable } });
  
  try {
    const [room] = await db
      .select()
      .from(gameRoomsTable)
      .where(eq(gameRoomsTable.roomCode, roomCode))
      .limit(1);
    
    if (!room) {
      return c.json({ success: false, error: "Room not found" }, 404);
    }
    
    return c.json({ 
      success: true, 
      room: {
        id: room.id,
        roomCode: room.roomCode,
        gameMode: room.gameMode,
        status: room.status,
        player1Id: room.player1Id,
        player2Id: room.player2Id,
        gameState: JSON.parse(room.gameState)
      }
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return c.json({ success: false, error }, 500);
  }
});

// POST /api/games/room - Create a new room
gameApi.post(
  "/games/room",
  validator("json", (value, c) => {
    const { playerName, gameMode } = value as { playerName?: string; gameMode?: string };
    
    if (!playerName) {
      return c.json({
        success: false,
        error: "Player name is required"
      }, 400);
    }
    
    if (!gameMode || !['vs_ai', 'multiplayer'].includes(gameMode)) {
      return c.json({
        success: false,
        error: "Invalid game mode"
      }, 400);
    }
    
    return { 
      body: { 
        playerName,
        gameMode
      } 
    };
  }),
  async (c) => {
    const { playerName, gameMode } = c.req.valid("json").body;
    const db = drizzle(c.env.DB, { schema: { gameRoomsTable } });
    
    // Generate unique room code
    let roomCode: string;
    let attempts = 0;
    while (attempts < 10) {
      roomCode = generateRoomCode();
      const [existing] = await db
        .select()
        .from(gameRoomsTable)
        .where(eq(gameRoomsTable.roomCode, roomCode))
        .limit(1);
      
      if (!existing) break;
      attempts++;
    }
    
    if (attempts >= 10) {
      return c.json({ success: false, error: "Failed to generate unique room code" }, 500);
    }
    
    const gameId = `game-${Date.now()}`;
    const player1Id = `player-${Date.now()}-1`;
    
    // Create player 1
    const deck1 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
    for (let i = deck1.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck1[i], deck1[j]] = [deck1[j], deck1[i]];
    }
    
    const player1 = createPlayer(
      player1Id,
      playerName,
      ASHEN_LEGION_COMMANDERS[0],
      deck1
    );
    
    let gameState;
    let player2Id = null;
    
    if (gameMode === 'vs_ai') {
      // Create AI player
      player2Id = 'ai-player';
      const deck2 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
      for (let i = deck2.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck2[i], deck2[j]] = [deck2[j], deck2[i]];
      }
      
      const aiPlayer = createPlayer(
        player2Id,
        'AI Opponent',
        ASHEN_LEGION_COMMANDERS[1],
        deck2
      );
      
      gameState = createGameState(gameId, player1, aiPlayer);
      const gameManager = new GameManager(gameState);
      gameManager.initializeGame();
      gameState = gameManager.getGameState();
      
      // If AI goes first, process its turn
      if (gameState.currentPlayerIndex === 1) {
        await processAITurn(gameManager, 'ai-player');
        gameState = gameManager.getGameState();
      }
    } else {
      // Multiplayer - create placeholder for player 2
      const emptyPlayer = createPlayer(
        'waiting-for-player',
        'Waiting for player...',
        ASHEN_LEGION_COMMANDERS[1],
        []
      );
      gameState = createGameState(gameId, player1, emptyPlayer);
    }
    
    // Save to database
    try {
      await db.insert(gameRoomsTable).values({
        id: gameId,
        roomCode: roomCode!,
        gameState: JSON.stringify(gameState),
        player1Id,
        player2Id,
        gameMode,
        status: gameMode === 'vs_ai' ? 'active' : 'waiting'
      });
      
      return c.json({
        success: true,
        roomCode: roomCode!,
        gameId,
        playerId: player1Id,
        gameState
      }, 201);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      return c.json({ success: false, error }, 500);
    }
  }
);

// POST /api/games/room/:roomCode/join - Join an existing room
gameApi.post(
  "/games/room/:roomCode/join",
  validator("json", (value, c) => {
    const { playerName } = value as { playerName?: string };
    
    if (!playerName) {
      return c.json({
        success: false,
        error: "Player name is required"
      }, 400);
    }
    
    return { body: { playerName } };
  }),
  async (c) => {
    const roomCode = c.req.param("roomCode").toUpperCase();
    const { playerName } = c.req.valid("json").body;
    const db = drizzle(c.env.DB, { schema: { gameRoomsTable } });
    
    try {
      // Get the room
      const [room] = await db
        .select()
        .from(gameRoomsTable)
        .where(eq(gameRoomsTable.roomCode, roomCode))
        .limit(1);
      
      if (!room) {
        return c.json({ success: false, error: "Room not found" }, 404);
      }
      
      if (room.gameMode !== 'multiplayer') {
        return c.json({ success: false, error: "This is not a multiplayer room" }, 400);
      }
      
      if (room.status !== 'waiting') {
        return c.json({ success: false, error: "Room is not available" }, 400);
      }
      
      // Create player 2
      const player2Id = `player-${Date.now()}-2`;
      const deck2 = [...ASHEN_LEGION_CARDS.slice(0, 20)];
      for (let i = deck2.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck2[i], deck2[j]] = [deck2[j], deck2[i]];
      }
      
      const player2 = createPlayer(
        player2Id,
        playerName,
        ASHEN_LEGION_COMMANDERS[1],
        deck2
      );
      
      // Update game state with real player 2
      const gameState = JSON.parse(room.gameState);
      gameState.players[1] = player2;
      
      // Initialize game
      const gameManager = new GameManager(gameState);
      gameManager.initializeGame();
      const updatedGameState = gameManager.getGameState();
      
      // Update room in database
      await db
        .update(gameRoomsTable)
        .set({
          gameState: JSON.stringify(updatedGameState),
          player2Id,
          status: 'active',
          updatedAt: new Date().toISOString()
        })
        .where(eq(gameRoomsTable.id, room.id));
      
      return c.json({
        success: true,
        roomCode,
        gameId: room.id,
        playerId: player2Id,
        gameState: updatedGameState
      });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      return c.json({ success: false, error }, 500);
    }
  }
);

// POST /api/games/room/:roomCode/actions - Process a game action
gameApi.post(
  "/games/room/:roomCode/actions",
  validator("json", (value, c) => {
    const { type, playerId, data } = value as { type?: string; playerId?: string; data?: Record<string, unknown> };
    
    const validActions = ['playUnit', 'deployUnit', 'useCommander', 'drawCard', 'endTurn', 'surrender', 'mulligan'];
    if (!type || !validActions.includes(type)) {
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
    const roomCode = c.req.param("roomCode").toUpperCase();
    const { type, playerId, data } = c.req.valid("json").body;
    const db = drizzle(c.env.DB, { schema: { gameRoomsTable } });
    
    try {
      // Get the room
      const [room] = await db
        .select()
        .from(gameRoomsTable)
        .where(eq(gameRoomsTable.roomCode, roomCode))
        .limit(1);
      
      if (!room) {
        return c.json({ success: false, error: "Room not found" }, 404);
      }
      
      if (room.status !== 'active') {
        return c.json({ success: false, error: "Game is not active" }, 400);
      }
      
      // Load game state and process action
      const gameState = JSON.parse(room.gameState);
      const gameManager = new GameManager(gameState);
      
      const success = gameManager.processAction({
        type: type as 'playUnit' | 'deployUnit' | 'useCommander' | 'drawCard' | 'endTurn' | 'surrender' | 'mulligan',
        playerId,
        data,
        timestamp: new Date()
      });
      
      if (!success) {
        return c.json({
          success: false,
          error: "Invalid action or not allowed at this time"
        }, 400);
      }
      
      let updatedGameState = gameManager.getGameState();
      
      // If it's vs AI and it's now AI's turn, process AI turn
      if (room.gameMode === 'vs_ai') {
        const currentPlayer = updatedGameState.players[updatedGameState.currentPlayerIndex];
        console.log(`[API] Current player after action: ${currentPlayer.id}, action was: ${type}`);
        
        if (currentPlayer.id === 'ai-player') {
          console.log('[API] Triggering AI turn');
          await processAITurn(gameManager, 'ai-player');
          updatedGameState = gameManager.getGameState();
        }
      }
      
      // Check if game is over
      const status = updatedGameState.winner ? 'completed' : 'active';
      
      // Save updated game state
      await db
        .update(gameRoomsTable)
        .set({
          gameState: JSON.stringify(updatedGameState),
          status,
          updatedAt: new Date().toISOString()
        })
        .where(eq(gameRoomsTable.id, room.id));
      
      return c.json({
        success: true,
        gameState: updatedGameState
      });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      return c.json({ success: false, error }, 500);
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