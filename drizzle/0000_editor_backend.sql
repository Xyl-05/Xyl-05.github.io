CREATE TABLE `content_items` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`note` text,
	`image_key` text,
	`image_name` text,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `editors` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text NOT NULL,
	`invited_by` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `editors_email_unique` ON `editors` (`email`);
--> statement-breakpoint
CREATE TABLE `editor_invites` (
	`email` text PRIMARY KEY NOT NULL,
	`invited_by` text NOT NULL,
	`created_at` integer NOT NULL
);
