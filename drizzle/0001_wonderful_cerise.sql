CREATE TABLE `logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`blockNumber` integer NOT NULL,
	`logIndex` integer NOT NULL,
	`topics` text,
	`data` text
);
