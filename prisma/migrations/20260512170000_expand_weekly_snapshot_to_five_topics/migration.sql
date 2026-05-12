ALTER TABLE `WeeklyHoroscopeSnapshot`
  ADD COLUMN `obstacleText` TEXT NOT NULL AFTER `financeText`,
  ADD COLUMN `obstacleScore` INTEGER NOT NULL AFTER `financeScore`;

UPDATE `WeeklyHoroscopeSnapshot`
SET
  `obstacleText` = '',
  `obstacleScore` = 0;
