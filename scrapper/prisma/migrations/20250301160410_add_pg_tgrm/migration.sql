CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX base_component_unified_name_trgm ON "BaseComponent" USING GIN ("componentUnifiedName" gin_trgm_ops);
CREATE INDEX component_in_marketplaces_unified_name_trgm ON "ComponentInMarketplaces" USING GIN ("componentUnifiedName" gin_trgm_ops);
CREATE INDEX archived_component_in_marketplaces_unified_name_trgm ON "ArchivedComponentInMarketplaces" USING GIN ("componentUnifiedName" gin_trgm_ops);