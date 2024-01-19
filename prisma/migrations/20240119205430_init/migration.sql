/*
  Warnings:

  - Added the required column `creatorId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `creatorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
