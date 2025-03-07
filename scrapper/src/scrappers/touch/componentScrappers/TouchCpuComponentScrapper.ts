import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { prisma } from "../../../prisma";
import { Prisma } from "@prisma/client";

export class TouchCpuComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/processory/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        const listPage = await this.componentPage.browser().newPage();

        console.log('TOUCH CPU started...');

        let pageNumber = 1;
        let hasNext = true;

        while (hasNext) {
            const componentsPageUrl = `${this.componentBaseUrl}${pageNumber}`;

            await listPage.goto(componentsPageUrl, { waitUntil: 'domcontentloaded' });

            const listPageBody = await listPage.$('body');
            const componentsHrefs = await listPage.evaluate(b => {
                return Array.from(b.querySelectorAll('.items.productList .tabloid .name')).map(el => el.getAttribute('href'));
            }, listPageBody);

            for (const componentHref of componentsHrefs) {
                if (!componentHref) {
                    console.log('wtf (no href was found)');
                    continue;
                }

                const componentUrl = this.baseUrl + componentHref;

                await this.componentPage.goto(componentUrl, {  waitUntil: 'domcontentloaded' });

                const scrappedComponent = await (await this.componentPage.$('body')).evaluate(b => {
                    const name = b.querySelector('.item_name').textContent.trim();
                    const price = parseInt(b.querySelector('.price').textContent.trim().replace(/[^\d]/g, ""), 10);

                    if (price === 0) {
                        return null;
                    }

                    const rows = b.querySelectorAll('tr.row_gray, tr.row_white');
                    let characteristics = new Map<string, string>();

                    rows.forEach(row => {
                        const nameElement = row.querySelector('.cell_name span');
                        const valueElement = row.querySelector('.cell_value span');

                        if (nameElement && valueElement) {
                            characteristics.set(
                                nameElement.textContent.trim(),
                                valueElement.textContent.trim(),
                            );
                        }
                    });

                    return {
                        name,
                        price,
                        rating: 0,
                        manufacturer: characteristics.get('Бренд'),
                        socket: characteristics.get('Сокет'),
                        coreCount: characteristics.get('Кількість ядер'),
                        threadCount: characteristics.get('Кількість потоків'),
                        tpd: characteristics.get('Тепловиділення (TDP)'),
                        maxSupportedMemory: characteristics.get('Максимальний об\'єм оперативної пам\'яті'),
                        warranty: characteristics.get('Гарантійний термін'),
                    }
                });

                console.log('scrappedComponent =>', scrappedComponent);

                const dbComponentInMarketplace = await prisma.componentInMarketplaces.findFirst({
                    where: {
                        componentUnifiedName: scrappedComponent.name
                    }
                });

                console.log('dbComponentInMarketplace =>', dbComponentInMarketplace);

                const scrappedComponentInMarketplace: Prisma.ComponentInMarketplacesCreateInput = {
                    name: scrappedComponent.name,
                    componentUnifiedName: scrappedComponent.name,

                    price: scrappedComponent.price,
                    rating: scrappedComponent.rating,
                    warranty: scrappedComponent.warranty,

                    marketplaceName: TouchConsts.TOUCH_NAME,
                    URL: componentUrl
                };

                console.log('scrappedComponentInMarketplace =>', scrappedComponentInMarketplace);

                if (dbComponentInMarketplace) {
                    scrappedComponentInMarketplace.name = dbComponentInMarketplace.componentUnifiedName;

                    const componentUnifiedData = await prisma.cpuComponent.findFirst({
                        where: {
                            componentUnifiedName: scrappedComponent.name
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

                        await prisma.cpuComponent.update({
                            where: { id: componentUnifiedData.id },
                            data: componentUnifiedDataToUpdate,
                        });
                    }
                }

                const createdComponentInMarketplace = await prisma.componentInMarketplaces.create({
                    data: scrappedComponentInMarketplace
                });

                console.log('createdComponentInMarketplace =>', createdComponentInMarketplace);

                if (!dbComponentInMarketplace) {
                    const createdUnifiedData = await prisma.cpuComponent.create({
                        data: {
                            componentUnifiedName: scrappedComponent.name,
                            manufacturer: scrappedComponent.manufacturer,
                            socket: scrappedComponent.socket,
                            maxSupportedMemory: scrappedComponent.maxSupportedMemory,
                            coreCount: scrappedComponent.coreCount,
                            threadCount: scrappedComponent.threadCount,
                            tpd: scrappedComponent.tpd,
                            warranty: scrappedComponent.warranty,
                            highestRating: scrappedComponent.rating,
                            lowestPrice: scrappedComponent.price
                        }
                    });

                    console.log('createdUnifiedData =>', createdUnifiedData);
                }

                console.log(`${componentsPageUrl}`, scrappedComponent);
            }

            hasNext = await listPage.evaluate(b => {
                const canBtnGoNext = b.querySelector('.bx-pag-next a')
                return Boolean(b && canBtnGoNext);
            }, listPageBody);

            pageNumber++;

            // remove
            if (pageNumber === 5) hasNext = false;
        }

        await listPage.close();
    }
}