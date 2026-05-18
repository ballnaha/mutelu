CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `readMinutes` INTEGER NOT NULL DEFAULT 5,
    `authorName` VARCHAR(191) NOT NULL DEFAULT 'mulamoon Editorial',
    `authorRole` VARCHAR(191) NULL,
    `heroImage` VARCHAR(191) NULL,
    `tags` JSON NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_status_publishedAt_idx`(`status`, `publishedAt`),
    INDEX `BlogPost_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BlogPostSection` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `heading` VARCHAR(191) NOT NULL,
    `paragraphs` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BlogPostSection_postId_sortOrder_idx`(`postId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BlogAffiliateProduct` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `productSlug` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `priceLabel` VARCHAR(191) NULL,
    `highlights` JSON NULL,
    `badge` VARCHAR(191) NULL,
    `accent` VARCHAR(191) NOT NULL DEFAULT '#2563eb',
    `targetUrl` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogAffiliateProduct_platform_productSlug_key`(`platform`, `productSlug`),
    INDEX `BlogAffiliateProduct_postId_sortOrder_idx`(`postId`, `sortOrder`),
    INDEX `BlogAffiliateProduct_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `BlogPostSection`
    ADD CONSTRAINT `BlogPostSection_postId_fkey`
    FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `BlogAffiliateProduct`
    ADD CONSTRAINT `BlogAffiliateProduct_postId_fkey`
    FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
