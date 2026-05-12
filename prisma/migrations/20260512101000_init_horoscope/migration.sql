-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `zodiacSignId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_zodiacSignId_idx`(`zodiacSignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZodiacSign` (
    `id` INTEGER NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startMonth` INTEGER NOT NULL,
    `startDay` INTEGER NOT NULL,
    `endMonth` INTEGER NOT NULL,
    `endDay` INTEGER NOT NULL,
    `element` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ZodiacSign_slug_key`(`slug`),
    UNIQUE INDEX `ZodiacSign_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horoscope` (
    `id` VARCHAR(191) NOT NULL,
    `zodiacSignId` INTEGER NOT NULL,
    `scope` ENUM('DAILY', 'MONTHLY') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `highlight` VARCHAR(191) NULL,
    `caution` VARCHAR(191) NULL,
    `luckyColor` VARCHAR(191) NULL,
    `luckyNumber` INTEGER NULL,
    `publishDate` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Horoscope_scope_publishDate_status_idx`(`scope`, `publishDate`, `status`),
    INDEX `Horoscope_status_idx`(`status`),
    UNIQUE INDEX `Horoscope_zodiacSignId_scope_publishDate_key`(`zodiacSignId`, `scope`, `publishDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_zodiacSignId_fkey` FOREIGN KEY (`zodiacSignId`) REFERENCES `ZodiacSign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horoscope` ADD CONSTRAINT `Horoscope_zodiacSignId_fkey` FOREIGN KEY (`zodiacSignId`) REFERENCES `ZodiacSign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
