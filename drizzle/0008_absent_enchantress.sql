ALTER TABLE `labels` RENAME COLUMN `typeId` TO `type_id`;--> statement-breakpoint
ALTER TABLE `labels` RENAME COLUMN `namespaceId` TO `namespace_id`;--> statement-breakpoint
ALTER TABLE `labels` RENAME COLUMN `iconUrl` TO `icon_url`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_labels`;--> statement-breakpoint
CREATE INDEX `idx_labels` ON `labels` (`chain`,`address`,`type_id`);