-- AlterTable
ALTER TABLE `categories` ADD COLUMN `refNo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `expDate` DATETIME(3) NULL,
    ADD COLUMN `manDate` DATETIME(3) NULL,
    ADD COLUMN `refNo` VARCHAR(191) NULL,
    ADD COLUMN `sellingPrice` INTEGER NULL;

-- AlterTable
ALTER TABLE `sales` ADD COLUMN `customerName` VARCHAR(191) NULL DEFAULT 'N/A',
    ADD COLUMN `refNo` VARCHAR(191) NULL,
    ADD COLUMN `totalAmount` INTEGER NULL;
