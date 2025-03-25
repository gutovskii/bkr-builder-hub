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
        componentPage: ElementHandle<HTMLBodyElement>,
        getAdditionalDataStr: string,
    ) => Promise<ScrappedComponentBaseData>,
    getAdditionalData: (characteristics: Map<string, string>, name: string, price: number) => Record<string, string | number>,
}

export type ScrappedComponentBaseData = {
    name: string;
    rating: number;
    price: number;
    warranty: string;
    imgUrls: string[];
    jsonCharacteristics: string,
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
    console.log(`${marketplaceName}/${dbModel.toString()} started...`);

    const listPage = await componentPage.browser().newPage();
    const itemPage = await componentPage.browser().newPage();

    let pageNumber = 1;
    let hasNext = true;

    while (hasNext) {
        const componentsPageUrl = getComponentsPageUrl(pageNumber);
        console.log('componentsPageUrl =>', componentsPageUrl);
        await listPage.goto(componentsPageUrl);

        const listPageBody = await listPage.$('body');
        const componentsHrefs = await getComponentsHrefs(listPageBody);

        console.log('componentsHrefs =>', componentsHrefs);

        for (const componentHref of componentsHrefs) {
            if (!componentHref) {
                console.log('wtf (no href was found)');
                continue;
            }

            const componentUrl = componentHref.includes('https') ? componentHref : baseUrl + componentHref;
            
            // await new Promise(res => setTimeout(res, Math.floor(Math.random() * (1000 - 500 + 1)) + 500));
            console.log('componentUrl =>', componentUrl);
            await itemPage.goto(componentUrl);
            console.log('itemPage.url() =>', itemPage.url());
            if (itemPage.url().includes('https://touch.com.ua/ua/?')) {
                continue;
            }

            const scrappedComponent = await getScrappedData(
                await itemPage.$('body'),
                getAdditionalData.toString(),
            );

            console.log('scrappedComponent =>', scrappedComponent);
        
            const dbComponentInMarketplace = await prisma.componentInMarketplaces.findFirst({
                where: {
                    componentUnifiedName: scrappedComponent.name,
                }
            });
            console.log('dbComponentInMarketplace =>', dbComponentInMarketplace);
            
            const componentUnifiedData = await (prisma[dbModel] as any).findFirst({
                where: {
                    componentUnifiedName: scrappedComponent.name,
                }
            });
            console.log('componentUnifiedData =>', componentUnifiedData);

            if (dbComponentInMarketplace) {
                let toUpdateUnifiedData = false;

                if (componentUnifiedData.highestRating < scrappedComponent.rating) {
                    componentUnifiedData.highestRating = scrappedComponent.rating;
                    toUpdateUnifiedData = true;
                }

                if (componentUnifiedData.lowestPrice > scrappedComponent.price) {
                    componentUnifiedData.lowestPrice = scrappedComponent.price;
                    toUpdateUnifiedData = true;
                }

                // update highest rating and lowest price
                if (toUpdateUnifiedData) {
                    const { id, componentType, ...componentUnifiedDataToUpdate } = componentUnifiedData;

                    await (prisma[dbModel] as any).update({
                        where: { id: componentUnifiedData.id },
                        data: componentUnifiedDataToUpdate,
                    });
                }
            }

            const createdComponentInMarketplace = await prisma.componentInMarketplaces.create({
                data: {
                    name: dbComponentInMarketplace === null ? scrappedComponent.name : dbComponentInMarketplace.name,
                    componentUnifiedName: scrappedComponent.name,
                    price: scrappedComponent.price,
                    rating: scrappedComponent.rating,
                    warranty: scrappedComponent.warranty,
                    marketplaceName: marketplaceName,
                    URL: componentHref,
                },
            });

            console.log('createdComponentInMarketplace =>', createdComponentInMarketplace);

            if (!dbComponentInMarketplace) {
                const { name, price, rating, ...unifiedDataToCreate } = scrappedComponent;
                const createdUnifiedData = await (prisma[dbModel] as any).create({
                    data: {
                        ...unifiedDataToCreate,
                        componentUnifiedName: scrappedComponent.name,
                        highestRating: scrappedComponent.rating,
                        lowestPrice: scrappedComponent.price,
                    }
                });

                createdComponentInMarketplace.unifiedComponentId = createdUnifiedData.id;

                await prisma.componentInMarketplaces.update({
                    where: { id: createdComponentInMarketplace.id },
                    data: createdComponentInMarketplace,
                });

                const componentFilter = await prisma.componentsFilters.findFirst({
                    where: {
                        componentType: createdUnifiedData.componentType,
                    }
                });

                if (!componentFilter) {
                    await prisma.componentsFilters.create({
                        data: {
                            componentType: createdUnifiedData.componentType,
                            filters: Object.entries(({ 
                                ...JSON.parse(scrappedComponent.jsonCharacteristics), 
                                price: scrappedComponent.price
                            } as Record<string, string | number>))
                                .map(([key, value]) => {
                                    if (typeof value === 'string') {
                                        if (/\d+(\.\d+)?\s*[a-zA-ZА-Яа-я]+/.test(value)) {
                                            console.log('filterToParse (create): ', key, value);
                                            const parsedValueNumber = Number(value.match(/\d+(\.\d+)?/)[0]);
                                            const parsedMeasuring = value.match(/\d+(\.\d+)?\s*([a-zA-ZА-Яа-я]+)/)[2];
                                            return {
                                                title: key,
                                                maxValue: parsedValueNumber,
                                                minValue: parsedValueNumber,
                                                measuring: parsedMeasuring, 
                                            };
                                        } else if (!Number.isNaN(Number(value))) {
                                            return {
                                                title: key,
                                                maxValue: Number(value),
                                                minValue: Number(value),
                                            }
                                        } else {
                                            return {
                                                title: key,
                                                characteristics: [value],
                                            }
                                        }
                                    } else {
                                        return {
                                            title: key, // todo fooBar => Foo Bar | Foo bar
                                            maxValue: value,
                                            minValue: value,
                                        }
                                    }
                                }),
                        },
                    });
                } else {
                    const existingFilters = componentFilter.filters;
                    const newComponentFilters = { 
                        ...JSON.parse(scrappedComponent.jsonCharacteristics),
                        price: scrappedComponent.price,
                    } as Record<string, string | number>;

                    Object.entries(newComponentFilters).map(([key, value]) => {
                        const filterToUpdate = componentFilter.filters.find(f => f.title === key);

                        if (!filterToUpdate) return;

                        if (filterToUpdate.characteristics && 
                            !filterToUpdate.characteristics.includes(value as string)
                        ) {
                            filterToUpdate.characteristics.push(value as string);
                        } else if (filterToUpdate.minValue && filterToUpdate.maxValue) {
                            let parsedValue = value;

                            if (typeof value === 'string') {
                                const parsedValueNumber = Number(value.match(/\d+(\.\d+)?/)[0]);
                                parsedValue = parsedValueNumber;
                            }

                            parsedValue = Number(parsedValue);

                            if (filterToUpdate.minValue > parsedValue) {
                                filterToUpdate.minValue = parsedValue;
                            } else if (filterToUpdate.maxValue < parsedValue) {
                                filterToUpdate.maxValue = parsedValue;
                            }
                        }
                    });
                    
                    await prisma.componentsFilters.update({
                        where: {
                            componentType: componentFilter.componentType,
                        },
                        data: {
                            filters: existingFilters,
                        },
                    });
                }

                console.log('createdUnifiedData =>', createdUnifiedData);
            }
            
            console.log(`${componentsPageUrl}`, scrappedComponent);
        }

        hasNext = await getHasNext(listPageBody);
        pageNumber++;
        
        // Todo: remove
        if (pageNumber === 3) hasNext = false;
    }

    await listPage.close();
    await itemPage.close();
}