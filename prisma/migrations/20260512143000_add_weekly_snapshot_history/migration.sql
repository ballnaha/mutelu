CREATE TABLE `WeeklyHoroscopeSnapshot` (
    `id` VARCHAR(191) NOT NULL,
    `zodiacSignId` INTEGER NOT NULL,
    `weekStart` DATETIME(3) NOT NULL,
    `weekEnd` DATETIME(3) NOT NULL,
    `weekLabel` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `careerText` TEXT NOT NULL,
    `financeText` TEXT NOT NULL,
    `loveText` TEXT NOT NULL,
    `healthText` TEXT NOT NULL,
    `careerScore` INTEGER NOT NULL,
    `financeScore` INTEGER NOT NULL,
    `loveScore` INTEGER NOT NULL,
    `healthScore` INTEGER NOT NULL,
    `overallScore` INTEGER NOT NULL,
    `dominantPlanet` VARCHAR(191) NOT NULL,
    `luckyColor` VARCHAR(191) NOT NULL,
    `methodology` VARCHAR(191) NOT NULL,
    `logicVersion` VARCHAR(191) NOT NULL,
    `computedData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WeeklyHoroscopeSnapshot_zodiacSignId_weekStart_key`(`zodiacSignId`, `weekStart`),
    INDEX `WeeklyHoroscopeSnapshot_weekStart_weekEnd_idx`(`weekStart`, `weekEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `WeeklyHoroscopeSnapshot`
    ADD CONSTRAINT `WeeklyHoroscopeSnapshot_zodiacSignId_fkey`
    FOREIGN KEY (`zodiacSignId`) REFERENCES `ZodiacSign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
