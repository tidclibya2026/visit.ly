CREATE TABLE `translation_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`destinationId` varchar(64) NOT NULL,
	`language` enum('en','fr','it','de','es','zh') NOT NULL,
	`sourceJson` text NOT NULL,
	`machineJson` text NOT NULL,
	`editedJson` text,
	`status` enum('pending','approved','needs_revision') NOT NULL DEFAULT 'pending',
	`reviewerOpenId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `translation_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
