import { Prisma } from "@prisma/client";
import { PrismaClient } from "@zenstackhq/runtime";
import { ElementHandle, Page } from "puppeteer";

export type PaginationConfig<TModel> = {
    marketplaceName: string,
    baseUrl: string,
    componentPage: Page,
    prisma: PrismaClient,
    dbModel: TModel,
    getComponentsPageUrl: (pageNumber: number) => string,
    getComponentsHrefs: (listPageBody: ElementHandle<HTMLBodyElement>) => Promise<string[]>,
    getHasNext: (listPageBody: ElementHandle<HTMLBodyElement>) => Promise<boolean>,
    getScrappedData: (
        componentPageBody: ElementHandle<HTMLBodyElement>,
        getAdditionalData: (characteristics: Map<string, string>, name: string, price: number) => Record<string, string | number>,
    ) => Promise<any>,
    getAdditionalData: (characteristics: Map<string, string>, name: string, price: number) => Record<string, string | number>,
}

export type MarketplacePaginationConfig<TModel> = Omit<PaginationConfig<TModel>, 'dbModel' | 'getAdditionalData'>

export async function paginateScrapping<
    TModel extends keyof PrismaClient,
>(
    { 
        marketplaceName,
        baseUrl,
        componentPage,
        prisma,
        dbModel,
        getComponentsPageUrl,
        getComponentsHrefs,
        getHasNext,
        getScrappedData,
        getAdditionalData,
    }: PaginationConfig<TModel>
) {
    console.log(`${marketplaceName}/${dbModel} started...`);
    
    const listPage = await componentPage.browser().newPage();

    let pageNumber = 1;
    let hasNext = true;

    while (hasNext) {
        const componentsPageUrl = getComponentsPageUrl(pageNumber);

        await listPage.goto(componentsPageUrl);

        const listPageBody = await listPage.$('body');
        const componentsHrefs = await getComponentsHrefs(listPageBody);

        for (const componentHref of componentsHrefs) {
            if (!componentHref) {
                console.log('wtf (no href was found)');
                continue;
            }

            const componentUrl = baseUrl + componentHref;

            await componentPage.goto(componentUrl);

            const scrappedComponent = await getScrappedData(
                await componentPage.$('body'), 
                getAdditionalData
            );
        
            const dbComponentInMarketplace = await prisma.componentInMarketplaces.findFirst({
                where: {
                    componentUnifiedName: scrappedComponent.name,
                }
            });
            
            console.log('dbComponentInMarketplace =>', dbComponentInMarketplace);

            const scrappedComponentInMarketplace: Prisma.ComponentInMarketplacesCreateInput = {
                name: scrappedComponent.name,
                componentUnifiedName: scrappedComponent.name,

                price: scrappedComponent.price,
                rating: scrappedComponent.rating,
                warranty: scrappedComponent.warranty,

                marketplaceName: marketplaceName,
                URL: componentHref,
            }

            console.log('scrappedComponentInMarketplace =>', scrappedComponentInMarketplace);

            if (dbComponentInMarketplace) {
                scrappedComponentInMarketplace.name = dbComponentInMarketplace.componentUnifiedName;

                const componentUnifiedData = await (prisma[dbModel] as any).findFirst({
                    where: {
                        componentUnifiedName: dbComponentInMarketplace.componentUnifiedName
                    }
                });

                console.log('componentUnifiedData =>', componentUnifiedData);

                let toUpdateUnifiedData = false;

                if (componentUnifiedData.highestRating < scrappedComponentInMarketplace.rating) {
                    componentUnifiedData.highestRating = scrappedComponentInMarketplace.rating;
                    toUpdateUnifiedData = true;
                }

                if (componentUnifiedData.lowestPrice > scrappedComponentInMarketplace.price) {
                    componentUnifiedData.lowestPrice = scrappedComponent.price; // crazy sht
                    toUpdateUnifiedData = true;
                }

                if (toUpdateUnifiedData) {
                    const { id, componentType, ...componentUnifiedDataToUpdate } = componentUnifiedData;

                    await (prisma[dbModel] as any).update({
                        where: { id: componentUnifiedData.id },
                        data: componentUnifiedDataToUpdate,
                    });
                }
            }

            const createdComponentInMarketplace = await prisma.componentInMarketplaces.create({
                data: scrappedComponentInMarketplace,
            });

            console.log('createdComponentInMarketplace =>', createdComponentInMarketplace);

            if (!dbComponentInMarketplace) {
                const createdUnifiedData = await prisma.cpuComponent.create({
                    data: {
                        ...scrappedComponent as any,
                        componentUnifiedName: scrappedComponent.name,
                        highestRating: scrappedComponent.rating,
                        lowestPrice: scrappedComponent.price,
                    }
                });

                console.log('createdUnifiedData =>', createdUnifiedData);
            }
            
            console.log(`${componentsPageUrl}`, scrappedComponent);
        }

        hasNext = await getHasNext(listPageBody);

        pageNumber++;

        // Todo: remove
        if (pageNumber === 4) hasNext = false;
    }

    await listPage.close();
}