import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";

export class ItboxVideoCardComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Videokarti-c3216/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'videoCardComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    volume: characteristics.get("Об'єм вбудованої пам'яті"),
                    chipset: characteristics.get("Графічний чип"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    bitCapacityOfTheMemoryBus: characteristics.get("Розрядність шини пам'яті"),
                    memoryFrequency: characteristics.get("Частота пам'яті"),
                    coreFrequency: characteristics.get("Частота ядра (Boost)"),
                }
            },
        });
    }
}