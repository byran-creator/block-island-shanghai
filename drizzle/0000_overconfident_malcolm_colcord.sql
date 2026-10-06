CREATE TABLE `game_saves` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`saved_at` text NOT NULL,
	`crystals` integer NOT NULL,
	`placed` integer NOT NULL,
	`best` real,
	`object_key` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_game_saves_user_time` ON `game_saves` (`user_id`,`saved_at`);