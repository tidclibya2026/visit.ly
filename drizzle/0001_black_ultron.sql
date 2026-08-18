CREATE TABLE `translation_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int,
	`destinationId` varchar(64) NOT NULL,
	`language` enum('en','fr','it','de','es','zh') NOT NULL,
	`action` enum('generated','edited','approved','needs_revision','suggestion_received') NOT NULL,
	`actorOpenId` varchar(64),
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `translation_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `translation_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`destinationId` varchar(64) NOT NULL,
	`language` enum('ar','en','fr','it','de','es','zh') NOT NULL,
	`originalText` text NOT NULL,
	`suggestedText` text NOT NULL,
	`contextUrl` varchar(512) NOT NULL,
	`status` enum('pending','reviewed','closed') NOT NULL DEFAULT 'pending',
	`reviewedByOpenId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `translation_suggestions_id` PRIMARY KEY(`id`)
);
