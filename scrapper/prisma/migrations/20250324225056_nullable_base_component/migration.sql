-- DropForeignKey
ALTER TABLE "ComponentInMarketplaces" DROP CONSTRAINT "ComponentInMarketplaces_unifiedComponentId_fkey";

-- AlterTable
ALTER TABLE "ComponentInMarketplaces" ALTER COLUMN "unifiedComponentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ComponentInMarketplaces" ADD CONSTRAINT "ComponentInMarketplaces_unifiedComponentId_fkey" FOREIGN KEY ("unifiedComponentId") REFERENCES "BaseComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
