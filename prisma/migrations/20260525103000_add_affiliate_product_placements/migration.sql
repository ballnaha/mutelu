ALTER TABLE `MasterAffiliateProduct`
  ADD COLUMN `placements` JSON NULL;

UPDATE `MasterAffiliateProduct`
SET `placements` = JSON_ARRAY('LUCKY_COLORS')
WHERE `category` = 'สีมงคล';
