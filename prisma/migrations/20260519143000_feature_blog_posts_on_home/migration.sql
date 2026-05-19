-- AlterTable
ALTER TABLE `blogpost`
  ADD COLUMN `featuredOnHome` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `homeHeroSlot` INTEGER NULL;

-- CreateIndex
CREATE INDEX `BlogPost_featuredOnHome_homeHeroSlot_status_publishedAt_idx` ON `blogpost`(`featuredOnHome`, `homeHeroSlot`, `status`, `publishedAt`);
