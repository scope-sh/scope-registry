DROP INDEX IF EXISTS `idx_logs`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_logs_metadata`;--> statement-breakpoint
ALTER TABLE `logs` ADD `topic0` text;--> statement-breakpoint
ALTER TABLE `logs` ADD `topic1` text;--> statement-breakpoint
ALTER TABLE `logs` ADD `topic2` text;--> statement-breakpoint
ALTER TABLE `logs` ADD `topic3` text;--> statement-breakpoint
ALTER TABLE `logs_metadata` ADD `topic0` text;--> statement-breakpoint
CREATE INDEX `idx_logs` ON `logs` (`chain`,`address`,`topic0`);--> statement-breakpoint
CREATE INDEX `idx_logs_metadata` ON `logs_metadata` (`chain`,`address`,`topic0`);--> statement-breakpoint
ALTER TABLE `logs` DROP COLUMN `topics`;--> statement-breakpoint
ALTER TABLE `logs_metadata` DROP COLUMN `topics`;