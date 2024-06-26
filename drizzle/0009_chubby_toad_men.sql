DROP INDEX IF EXISTS `idx_labels`;--> statement-breakpoint
CREATE INDEX `idx_labels` ON `labels` (`chain`,`address`);