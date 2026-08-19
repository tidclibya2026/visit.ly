CREATE TABLE `interaction_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` enum('destination_open','atlas_marker_select','language_switch') NOT NULL,
	`destinationId` varchar(64),
	`language` enum('ar','en','fr','it','de','es','zh') NOT NULL,
	`sessionKey` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interaction_events_id` PRIMARY KEY(`id`)
);
