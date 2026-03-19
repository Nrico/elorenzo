CREATE DATABASE IF NOT EXISTS `portfolio_db`;
USE `portfolio_db`;

CREATE TABLE IF NOT EXISTS `journal_posts` (
  `id` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `cover_image_url` varchar(255) DEFAULT '',
  `excerpt` text,
  `tags` json DEFAULT NULL,
  `blocks` json NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
