-- AlterTable
ALTER TABLE "BaseComponent" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "ComponentInMarketplaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketplaceName" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "rating" DOUBLE PRECISION,
    "warranty" TEXT,
    "URL" TEXT NOT NULL,
    "componentUnifiedName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComponentInMarketplaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedComponentInMarketplaces" (
    "id" TEXT NOT NULL,
    "marketplaceName" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "rating" DOUBLE PRECISION,
    "warranty" TEXT,
    "URL" TEXT NOT NULL,
    "componentUnifiedName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivedComponentInMarketplaces_pkey" PRIMARY KEY ("id")
);
