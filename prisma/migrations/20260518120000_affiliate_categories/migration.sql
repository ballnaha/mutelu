CREATE TABLE `AffiliateCategory` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `AffiliateCategory_name_key`(`name`),
  UNIQUE INDEX `AffiliateCategory_slug_key`(`slug`),
  INDEX `AffiliateCategory_isActive_idx`(`isActive`),
  INDEX `AffiliateCategory_sortOrder_idx`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `AffiliateCategory` (`id`, `name`, `slug`, `sortOrder`, `updatedAt`)
VALUES
  ('affcat_jewelry', 'เครื่องประดับ', 'jewelry', 10, CURRENT_TIMESTAMP(3)),
  ('affcat_home_decor', 'ของตกแต่งบ้าน', 'home-decor', 20, CURRENT_TIMESTAMP(3)),
  ('affcat_wallpaper', 'วอลเปเปอร์', 'wallpaper', 30, CURRENT_TIMESTAMP(3)),
  ('affcat_beauty', 'ความงาม', 'beauty', 40, CURRENT_TIMESTAMP(3)),
  ('affcat_lifestyle', 'ของใช้ส่วนตัว', 'lifestyle', 50, CURRENT_TIMESTAMP(3)),
  ('affcat_other', 'อื่นๆ', 'other', 60, CURRENT_TIMESTAMP(3));
