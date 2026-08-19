CREATE TABLE `content_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`resource` enum('destinations','experiences','sections','media','visa','users') NOT NULL,
	`canCreate` boolean NOT NULL DEFAULT false,
	`canEdit` boolean NOT NULL DEFAULT false,
	`canPublish` boolean NOT NULL DEFAULT false,
	`canReview` boolean NOT NULL DEFAULT false,
	`grantedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visa_intake_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intakeId` int NOT NULL,
	`status` enum('received','under_review','awaiting_information','ready_for_official_referral','closed') NOT NULL,
	`note` text,
	`actorOpenId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visa_intake_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `visa_intakes` MODIFY COLUMN `status` enum('received','under_review','awaiting_information','ready_for_official_referral','closed') NOT NULL DEFAULT 'received';
