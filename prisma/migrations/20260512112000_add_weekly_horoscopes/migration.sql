ALTER TABLE `Horoscope`
    MODIFY `scope` ENUM('DAILY', 'WEEKLY', 'MONTHLY') NOT NULL,
    ADD COLUMN `weekStart` DATETIME(3) NULL AFTER `publishDate`,
    ADD COLUMN `weekEnd` DATETIME(3) NULL AFTER `weekStart`;

CREATE INDEX `Horoscope_scope_status_weekStart_weekEnd_idx`
    ON `Horoscope`(`scope`, `status`, `weekStart`, `weekEnd`);
