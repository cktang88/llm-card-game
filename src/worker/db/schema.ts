import {
  sqliteTable,
  text,
  integer,
  // primaryKey, // Already identified as unused by linter
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(), // Using mode: 'boolean' for Drizzle, D1 stores as 0/1
  userName: text("user_name").notNull(), // Added userName field
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// Game rooms table for multiplayer
export const gameRooms = sqliteTable("game_rooms", {
  id: text("id").primaryKey(),
  roomCode: text("room_code").notNull().unique(),
  gameState: text("game_state").notNull(), // JSON serialized game state
  player1Id: text("player1_id"),
  player2Id: text("player2_id"),
  gameMode: text("game_mode").notNull(), // 'vs_ai' or 'multiplayer'
  status: text("status").notNull().default("waiting"), // 'waiting', 'active', 'completed'
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// If you plan to have more tables or more complex types, you can add them here.
// For example, a type for new todos (without id or createdAt)
export type NewTodo = typeof todos.$inferInsert;
export type SelectTodo = typeof todos.$inferSelect;
export type NewGameRoom = typeof gameRooms.$inferInsert;
export type SelectGameRoom = typeof gameRooms.$inferSelect;
