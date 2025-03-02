import { PrismaClient } from "@prisma/client";
import { enhance } from "@zenstackhq/runtime";
import { archivedComponentInMarketPlaceFindFirstExtension, archivedComponentInMarketPlaceFindManyExtension, baseComponentFindFirstExtension, baseComponentFindManyExtension, componentInMarketplaceFindFirstExtension, componentInMarketplaceFindManyExtension } from "./prisma-extensions";

const basePrisma = new PrismaClient();
const prisma = enhance(basePrisma);

prisma.$extends({
    query: {
        componentInMarketplaces: { findMany: componentInMarketplaceFindManyExtension, findFirst: componentInMarketplaceFindFirstExtension },
        archivedComponentInMarketplaces: { findMany: archivedComponentInMarketPlaceFindManyExtension, findFirst: archivedComponentInMarketPlaceFindFirstExtension },

        ssdComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        motherboardComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        caseComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        hddComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        cpuComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        coolerComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        memoryComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        powerSupplyComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
        videoCardComponent: { findMany: baseComponentFindManyExtension, findFirst: baseComponentFindFirstExtension },
    }
});

export { prisma, basePrisma };