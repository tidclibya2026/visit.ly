CREATE TABLE `admin_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` enum('visa_status','visa_note') NOT NULL,
	`visaIntakeId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_notifications_id` PRIMARY KEY(`id`)
);
