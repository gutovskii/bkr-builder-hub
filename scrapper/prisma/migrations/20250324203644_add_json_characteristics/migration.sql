/*
  Warnings:

  - Added the required column `jsonCharacteristics` to the `BaseComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unifiedComponentId` to the `ComponentInMarketplaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BaseComponent" ADD COLUMN     "imgUrls" TEXT[],
ADD COLUMN     "jsonCharacteristics" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "ComponentInMarketplaces" ADD COLUMN     "unifiedComponentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ComponentsFilters" (
    "id" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "filters" JSONB NOT NULL,

    CONSTRAINT "ComponentsFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildComment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,

    CONSTRAINT "BuildComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComponentsFilters_componentType_key" ON "ComponentsFilters"("componentType");

-- CreateIndex
CREATE INDEX "ArchivedComponentInMarketplaces_componentUnifiedName_idx" ON "ArchivedComponentInMarketplaces"("componentUnifiedName");

-- CreateIndex
CREATE INDEX "BaseComponent_componentUnifiedName_idx" ON "BaseComponent"("componentUnifiedName");

-- CreateIndex
CREATE INDEX "ComponentInMarketplaces_componentUnifiedName_idx" ON "ComponentInMarketplaces"("componentUnifiedName");

-- AddForeignKey
ALTER TABLE "BuildComment" ADD CONSTRAINT "BuildComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildComment" ADD CONSTRAINT "BuildComment_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "BuildEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentInMarketplaces" ADD CONSTRAINT "ComponentInMarketplaces_unifiedComponentId_fkey" FOREIGN KEY ("unifiedComponentId") REFERENCES "BaseComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
