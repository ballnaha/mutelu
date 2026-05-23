ALTER TABLE `MasterAffiliateProduct`
  ADD COLUMN `productType` ENUM('AFFILIATE', 'OWN_PRODUCT') NOT NULL DEFAULT 'AFFILIATE',
  ADD COLUMN `internalSlug` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `MasterAffiliateProduct_internalSlug_key`
  ON `MasterAffiliateProduct`(`internalSlug`);

CREATE INDEX `MasterAffiliateProduct_productType_idx`
  ON `MasterAffiliateProduct`(`productType`);
