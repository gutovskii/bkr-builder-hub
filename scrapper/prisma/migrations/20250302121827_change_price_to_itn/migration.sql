/*
  Warnings:

  - You are about to alter the column `price` on the `ArchivedComponentInMarketplaces` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `lowestPrice` on the `BaseComponent` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `price` on the `ComponentInMarketplaces` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/

-- AlterTable
ALTER TABLE "ArchivedComponentInMarketplaces" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "BaseComponent" ALTER COLUMN "lowestPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ComponentInMarketplaces" ALTER COLUMN "price" SET DATA TYPE INTEGER;
