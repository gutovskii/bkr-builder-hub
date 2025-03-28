import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukCpuComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/protsesori/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'cpuComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Сімейство процесорів").split(" ")[0],
                    socket: characteristics.get("Тип роз'єму"),
                    coreCount: characteristics.get("Кількість ядер"),
                    threadCount: characteristics.get("Кількість потоків"),
                    tpd: characteristics.get("Потужність TDP"),
                    maxSupportedMemory: characteristics.get("Максимальний об'єм пам'яті"),
                    warranty: characteristics.get("Гарантія"),
                };
            },
        });

        // while (hasNext) {
        //     const componentsPageUrl = pageNumber === 1 ? this.componentBaseUrl : `${this.componentBaseUrl}filter/page=${pageNumber}/`;

        //     await listPage.goto(componentsPageUrl);

        //     const listPageBody = await listPage.$('body');
        //     const componentsHrefs = await listPage.evaluate(b => {
        //         return Array.from(b.querySelectorAll('.catalogGrid.catalog-grid li meta:last-child')).map((meta: any) => meta.content);
        //     }, listPageBody);

        //     for (const componentHref of componentsHrefs) {
        //         if (!componentHref) {
        //             console.log('wtf (no href was found)');
        //             continue;
        //         }

        //         const componentUrl = this.baseUrl + componentHref;

        //         await this.componentPage.goto(componentUrl);

        //         const scrappedComponent = await (await this.componentPage.$('body')).evaluate(b => {
        //             const name = b.querySelector('.product-title').textContent.trim();
        //             const price = parseInt(b.querySelector('.product-price__item').textContent.trim().replace(/[^\d]/g, ""), 10);

        //             if (price === 0) {
        //                 return null;
        //             }

        //             const rows = b.querySelectorAll('.product-features__row');
        //             let characteristics = new Map<string, string>();

        //             rows.forEach(row => {
        //                 const nameElement = row.querySelector('.product-features__cell:first-child');
        //                 const valueElement = row.querySelector('.product-features__cell:last-child');

        //                 if (nameElement && valueElement) {
        //                     characteristics.set(
        //                         nameElement.textContent.trim(),
        //                         valueElement.textContent.trim(),
        //                     );
        //                 }
        //             });

        //             return {
        //                 name,
        //                 price,
        //                 rating: 0,
        //                 manufacturer: characteristics.get('Сімейство процесорів').split(' ')[0],
        //                 socket: characteristics.get('Тип роз\'єму'),
        //                 coreCount: characteristics.get('Кількість ядер'),
        //                 threadCount: characteristics.get('Кількість потоків'),
        //                 tpd: characteristics.get('Потужність TDP'),
        //                 maxSupportedMemory: characteristics.get('Максимальний об\'єм пам\'яті'),
        //                 warranty: characteristics.get('Гарантія'),
        //             };
        //         });

        //         console.log('scrappedComponent =>', scrappedComponent);

        //         if (scrappedComponent === null) {
        //             console.log('scrappedComponent.price =>', scrappedComponent.price);
        //             continue;
        //         }

        //         const dbComponentInMarketplace = await prisma.componentInMarketplaces.findFirst({
        //             where: {
        //                 componentUnifiedName: scrappedComponent.name
        //             }
        //         });

        //         console.log('dbComponentInMarketplace =>', dbComponentInMarketplace);

        //         const scrappedComponentInMarketplace: Prisma.ComponentInMarketplacesCreateInput = {
        //             name: scrappedComponent.name,
        //             componentUnifiedName: scrappedComponent.name,

        //             price: scrappedComponent.price,
        //             rating: scrappedComponent.rating,
        //             warranty: scrappedComponent.warranty,

        //             marketplaceName: ZhukConsts.ZHUK_NAME,
        //             URL: componentHref
        //         };

        //         console.log('scrappedComponentInMarketplace =>', scrappedComponentInMarketplace);

        //         if (dbComponentInMarketplace) {
        //             scrappedComponentInMarketplace.name = dbComponentInMarketplace.componentUnifiedName;

        //             const componentUnifiedData = await prisma.cpuComponent.findFirst({
        //                 where: {
        //                     componentUnifiedName: dbComponentInMarketplace.componentUnifiedName
        //                 }
        //             });

        //             console.log('componentUnifiedData =>', componentUnifiedData);

        //             let toUpdateUnifiedData = false;

        //             if (componentUnifiedData.highestRating < scrappedComponentInMarketplace.rating) {
        //                 componentUnifiedData.highestRating = scrappedComponentInMarketplace.rating;
        //                 toUpdateUnifiedData = true;
        //             }

        //             if (componentUnifiedData.lowestPrice > scrappedComponentInMarketplace.price) {
        //                 componentUnifiedData.lowestPrice = scrappedComponent.price; // crazy sht
        //                 toUpdateUnifiedData = true;
        //             }

        //             if (toUpdateUnifiedData) {
        //                 const { id, componentType, ...componentUnifiedDataToUpdate } = componentUnifiedData;

        //                 await prisma.cpuComponent.update({
        //                     where: { id: componentUnifiedData.id },
        //                     data: componentUnifiedDataToUpdate,
        //                 });
        //             }
        //         }

        //         const createdComponentInMarketplace = await prisma.componentInMarketplaces.create({
        //             data: scrappedComponentInMarketplace
        //         });

        //         console.log('createdComponentInMarketplace =>', createdComponentInMarketplace);

        //         if (!dbComponentInMarketplace) {
        //             const createdUnifiedData = await prisma.cpuComponent.create({
        //                 data: {
        //                     componentUnifiedName: scrappedComponent.name,
        //                     manufacturer: scrappedComponent.manufacturer,
        //                     socket: scrappedComponent.socket,
        //                     maxSupportedMemory: scrappedComponent.maxSupportedMemory,
        //                     coreCount: scrappedComponent.coreCount,
        //                     threadCount: scrappedComponent.threadCount,
        //                     tpd: scrappedComponent.tpd,
        //                     warranty: scrappedComponent.warranty,
        //                     highestRating: scrappedComponent.rating,
        //                     lowestPrice: scrappedComponent.price
        //                 }
        //             });

        //             console.log('createdUnifiedData =>', createdUnifiedData);
        //         }

        //         console.log(`${componentsPageUrl}`, scrappedComponent);
        //     }

        //     hasNext = await listPage.evaluate(b => {
        //         const canBtnGoNext = !b.querySelector('.pager__item--forth').classList.contains('is-disabled');
        //         return Boolean(b && canBtnGoNext);
        //     }, listPageBody);

        //     pageNumber++;

        //     // remove
        //     if (pageNumber === 5) hasNext = false;
        // }
    }
}