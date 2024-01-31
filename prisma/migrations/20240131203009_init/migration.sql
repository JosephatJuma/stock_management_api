/*
  Warnings:

  - You are about to drop the column `variantId` on the `salesitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `salesitem` DROP FOREIGN KEY `SalesItem_variantId_fkey`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `rate` DOUBLE NULL;

-- AlterTable
ALTER TABLE `salesitem` DROP COLUMN `variantId`;

-- AlterTable
ALTER TABLE `variant` ADD COLUMN `rate` DOUBLE NULL;
