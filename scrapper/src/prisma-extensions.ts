import { MARKETPLACES_COUNT } from "./main";
import { prisma } from "./prisma";

export const MIN_SIMILARITY_THRESHOLD = 0.9;

export const baseComponentFindManyExtension = async ({ args, query }: any) => {
    const componentUnifiedName = args.where.componentUnifiedName;

    if (!componentUnifiedName) return query(args);

    return prisma.$queryRaw`
        SELECT * FROM "BaseComponent"
        WHERE similarity(name, ${componentUnifiedName}) >= ${MIN_SIMILARITY_THRESHOLD}
        ORDER BY similarity(name, ${componentUnifiedName}) DESC
        LIMIT ${MARKETPLACES_COUNT};
    `;
};

export const baseComponentFindFirstExtension = async ({ args, query }: any) => {
    const componentUnifiedName = args.where.componentUnifiedName;

    if (!componentUnifiedName) return query(args);

    return prisma.$queryRaw`
        SELECT * FROM "BaseComponent"
        WHERE similarity(name, ${componentUnifiedName}) >= ${MIN_SIMILARITY_THRESHOLD}
        ORDER BY similarity(name, ${componentUnifiedName}) DESC
        LIMIT 1;
    `;
};

export const componentInMarketplaceFindManyExtension = async ({ args, query }: any) => {
    const componentUnifiedName = args.where.componentUnifiedName;

    if (!componentUnifiedName) return query(args);

    return prisma.$queryRaw`
        SELECT * FROM "ComponentInMarketplaces"
        WHERE similarity(name, ${componentUnifiedName}) >= ${MIN_SIMILARITY_THRESHOLD}
        ORDER BY similarity(name, ${componentUnifiedName}) DESC
        LIMIT ${MARKETPLACES_COUNT};
    `;
};

export const componentInMarketplaceFindFirstExtension = async ({ args, query }: any) => {
    const componentUnifiedName = args.where.componentUnifiedName;

    if (!componentUnifiedName) return query(args);

    return prisma.$queryRaw`
        SELECT * FROM "ComponentInMarketplaces"
        WHERE similarity(name, ${componentUnifiedName}) >= ${MIN_SIMILARITY_THRESHOLD}
        ORDER BY similarity(name, ${componentUnifiedName}) DESC
        LIMIT 1;
    `;
};

export const archivedComponentInMarketPlaceFindManyExtension = async ({ args, query }: any) => {
    const componentUnifiedName = args.where.componentUnifiedName;

    if (!componentUnifiedName) return query(args);

    return prisma.$queryRaw`
        SELECT * FROM "ArchivedComponentInMarketplaces"
        WHERE similarity(name, ${componentUnifiedName}) >= ${MIN_SIMILARITY_THRESHOLD}
        ORDER BY similarity(name, ${componentUnifiedName}) DESC
        LIMIT ${MARKETPLACES_COUNT};
    `;
};

export const archivedComponentInMarketPlaceFindFirstExtension = async ({ args, query }: any) => {
    const componentUnifiedName = args.where.componentUnifiedName;

    if (!componentUnifiedName) return query(args);

    return await prisma.$queryRaw`
        SELECT * FROM "ArchivedComponentInMarketplaces"
        WHERE similarity(name, ${componentUnifiedName}) >= ${MIN_SIMILARITY_THRESHOLD}
        ORDER BY similarity(name, ${componentUnifiedName}) DESC
        LIMIT 1;
    `;
};