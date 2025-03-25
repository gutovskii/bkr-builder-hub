import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";

export class ItboxHddComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Zhorstki_diski-c8373/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'hddComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    maxRotationSpeed: characteristics.get("Швидкість обертання шпинделя"),
                    noiseLevel: characteristics.get("Рівень шуму"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    formFactor: characteristics.get("Форм-фактор"),
                    volume: characteristics.get("Об'єм"),
                    // serias, compatability, physicalDimensions, weight
                };
            },
        });
    }
}