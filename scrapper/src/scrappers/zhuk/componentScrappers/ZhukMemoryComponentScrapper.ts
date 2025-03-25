import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukMemoryComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/operativna-pamyat/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'memoryComponent',
            getAdditionalData: (characteristics, name) => {
                return {
                    manufacturer: name.split(' ')[1],
                    warranty: characteristics.get("Гарантія"),
                    memoryType: characteristics.get("Тип пам'яті"),
                    memoryFrequence: characteristics.get("Частота пам'яті"),
                    volume: characteristics.get("Обсяг пам'яті"),
                    numberOfSlots: characteristics.get("Кількість планок"),
                    timingsSchema: characteristics.get("Схема таймінгів пам'яті"),
                };
            },
        });
    }
}