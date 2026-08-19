CREATE TABLE `content_user_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`role` enum('editor','reviewer') NOT NULL,
	`assignedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_user_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_user_roles_userOpenId_unique` UNIQUE(`userOpenId`)
);
