import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukVideoCardComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/videokarti/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'videoCardComponent',
            getAdditionalData: (characteristics, name) => {
                return {
                    manufacturer: name.split(' ')[1],
                    warranty: characteristics.get("Гарантія"),
                    volume: characteristics.get("Обсяг пам'яті"),
                    memoryType: characteristics.get("Тип пам'яті"),
                    chipset: characteristics.get("Графічний чіп"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    bitCapacityOfTheMemoryBus: characteristics.get("Розрядність шини пам'яті"),
                    memoryFrequency: characteristics.get("Частота пам'яті"),
                    coreFrequency: characteristics.get("Частота ядра"),
                    connectors: characteristics.get("Кількість займаних слотів"),
                };
            },
        });
    }
}