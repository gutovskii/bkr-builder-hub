import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";

export class ItboxMemoryComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Operativna_pamyat-c8371/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'memoryComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    memoryType: characteristics.get("Форм-фактор пам'яті"),
                    memoryFrequence: characteristics.get("Частота пам'яті"),
                    volume: characteristics.get("Об'єм пам'яті"),
                    numberOfSlots: characteristics.get("Кількість модулі у наборі"),
                };
            },
        });
    }
}