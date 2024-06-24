CREATE INDEX `idx_labels` ON `labels` (`chain`,`address`,`typeId`);--> statement-breakpoint
CREATE INDEX `idx_logs` ON `logs` (`chain`,`address`,`topics`);--> statement-breakpoint
CREATE INDEX `idx_logs_metadata` ON `logs_metadata` (`chain`,`address`,`topics`);