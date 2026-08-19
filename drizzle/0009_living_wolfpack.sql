CREATE TABLE `admin_monthly_targets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monthKey` varchar(7) NOT NULL,
	`visaTarget` int NOT NULL DEFAULT 0,
	`contentTarget` int NOT NULL DEFAULT 0,
	`setByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_monthly_targets_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_monthly_targets_monthKey_unique` UNIQUE(`monthKey`)
);
--> statement-breakpoint
ALTER TABLE `visa_intake_history` ADD `action` varchar(32) DEFAULT 'status' NOT NULL;--> statement-breakpoint
ALTER TABLE `visa_intakes` ADD `assignedToOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `visa_intakes` ADD `assignedByOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `visa_intakes` ADD `assignedAt` timestamp;