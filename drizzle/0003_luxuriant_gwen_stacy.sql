CREATE TABLE `logs_metadata` (
	`id` integer PRIMARY KEY NOT NULL,
	`chain` integer NOT NULL,
	`address` text NOT NULL,
	`topics` text,
	`latestBlockNumber` integer NOT NULL
);
