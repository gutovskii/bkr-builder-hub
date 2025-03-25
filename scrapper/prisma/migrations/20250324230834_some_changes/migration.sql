-- DropForeignKey
ALTER TABLE "ComponentInMarketplaces" DROP CONSTRAINT "ComponentInMarketplaces_unifiedComponentId_fkey";

-- AddForeignKey
ALTER TABLE "ComponentInMarketplaces" ADD CONSTRAINT "ComponentInMarketplaces_unifiedComponentId_fkey" FOREIGN KEY ("unifiedComponentId") REFERENCES "BaseComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX BaseComponent_componentUnifiedName_idx ON "BaseComponent" USING GIN ("componentUnifiedName" gin_trgm_ops);
CREATE INDEX ComponentInMarketplaces_componentUnifiedName_idx ON "ComponentInMarketplaces" USING GIN ("componentUnifiedName" gin_trgm_ops);
CREATE INDEX ArchivedComponentInMarketplaces_componentUnifiedName_idx ON "ArchivedComponentInMarketplaces" USING GIN ("componentUnifiedName" gin_trgm_ops);