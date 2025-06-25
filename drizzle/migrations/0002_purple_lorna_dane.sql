CREATE TABLE `game_rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`room_code` text NOT NULL,
	`game_state` text NOT NULL,
	`player1_id` text,
	`player2_id` text,
	`game_mode` text NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `game_rooms_room_code_unique` ON `game_rooms` (`room_code`);