CREATE TABLE `managed_destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(96) NOT NULL,
	`title` varchar(255) NOT NULL,
	`city` varchar(160) NOT NULL,
	`region` varchar(160) NOT NULL,
	`category` enum('city','heritage','nature','coast') NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(768),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByOpenId` varchar(64) NOT NULL,
	`updatedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `managed_destinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `managed_destinations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `managed_experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(96) NOT NULL,
	`title` varchar(255) NOT NULL,
	`destinationSlug` varchar(96),
	`region` varchar(160) NOT NULL,
	`season` varchar(120),
	`description` text NOT NULL,
	`imageUrl` varchar(768),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByOpenId` varchar(64) NOT NULL,
	`updatedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `managed_experiences_id` PRIMARY KEY(`id`),
	CONSTRAINT `managed_experiences_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `managed_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(96) NOT NULL,
	`sectionType` enum('festival','culture','heritage','travel','custom') NOT NULL,
	`title` varchar(255) NOT NULL,
	`summary` text NOT NULL,
	`imageUrl` varchar(768),
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByOpenId` varchar(64) NOT NULL,
	`updatedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `managed_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `managed_sections_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`url` varchar(768) NOT NULL,
	`altText` varchar(500) NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`caption` text,
	`mimeType` varchar(120) NOT NULL,
	`uploadedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visa_intakes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceCode` varchar(32) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`nationality` varchar(120) NOT NULL,
	`residenceCountry` varchar(120) NOT NULL,
	`travelPurpose` varchar(255) NOT NULL,
	`intendedArrival` varchar(32),
	`notes` text,
	`consentAcceptedAt` timestamp NOT NULL,
	`status` enum('received','ready_for_official_referral','closed') NOT NULL DEFAULT 'received',
	`reviewedByOpenId` varchar(64),
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visa_intakes_id` PRIMARY KEY(`id`),
	CONSTRAINT `visa_intakes_referenceCode_unique` UNIQUE(`referenceCode`)
);
