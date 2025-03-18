/*
  Warnings:

  - You are about to drop the column `color` on the `CaseComponent` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `CoolerComponent` table. All the data in the column will be lost.
  - You are about to drop the column `ratedVoltage` on the `CoolerComponent` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CoolerComponent` table. All the data in the column will be lost.
  - You are about to drop the column `socker` on the `CoolerComponent` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `HddComponent` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveThroughput` on the `MemoryComponent` table. All the data in the column will be lost.
  - You are about to drop the column `formFactor` on the `MemoryComponent` table. All the data in the column will be lost.
  - You are about to drop the column `socker` on the `MotherboardComponent` table. All the data in the column will be lost.
  - You are about to drop the column `compatability` on the `SsdComponent` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `VideoCardComponent` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "CaseComponent" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "CoolerComponent" DROP COLUMN "color",
DROP COLUMN "ratedVoltage",
DROP COLUMN "size",
DROP COLUMN "socker",
ADD COLUMN     "sizes" TEXT,
ADD COLUMN     "socket" TEXT,
ADD COLUMN     "tdp" TEXT;

-- AlterTable
ALTER TABLE "HddComponent" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "MemoryComponent" DROP COLUMN "effectiveThroughput",
DROP COLUMN "formFactor",
ADD COLUMN     "timingsSchema" TEXT;

-- AlterTable
ALTER TABLE "MotherboardComponent" DROP COLUMN "socker",
ADD COLUMN     "socket" TEXT;

-- AlterTable
ALTER TABLE "SsdComponent" DROP COLUMN "compatability",
ADD COLUMN     "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "VideoCardComponent" DROP COLUMN "color";
