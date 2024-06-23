CREATE TABLE `labels` (
	`id` integer PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`value` text NOT NULL,
	`typeId` text,
	`namespaceId` text,
	`iconUrl` text
);
