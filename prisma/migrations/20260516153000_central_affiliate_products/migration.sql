ALTER TABLE `MasterAffiliateProduct`
  ADD COLUMN `platform` VARCHAR(191) NOT NULL DEFAULT 'shopee',
  ADD COLUMN `productSlug` VARCHAR(191) NULL;

ALTER TABLE `BlogAffiliateProduct`
  ADD COLUMN `masterProductId` VARCHAR(191) NULL;

CREATE INDEX `MasterAffiliateProduct_platform_productSlug_idx`
  ON `MasterAffiliateProduct`(`platform`, `productSlug`);

CREATE INDEX `BlogAffiliateProduct_masterProductId_idx`
  ON `BlogAffiliateProduct`(`masterProductId`);

ALTER TABLE `BlogAffiliateProduct`
  ADD CONSTRAINT `BlogAffiliateProduct_masterProductId_fkey`
  FOREIGN KEY (`masterProductId`) REFERENCES `MasterAffiliateProduct`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
