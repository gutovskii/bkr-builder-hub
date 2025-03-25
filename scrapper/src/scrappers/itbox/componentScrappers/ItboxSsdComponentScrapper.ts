import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";

export class ItboxSsdComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/SSD_diski-c6861/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'ssdComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    volume: characteristics.get("Об'єм пам'яті"),
                    readingSpeed: characteristics.get("Швидкість читання"),
                    writingSpeed: characteristics.get("Швидкість запису"),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    physicalDimensions: characteristics.get("Габарити"),
                    weight: characteristics.get("Вага"),
                    formFactor: characteristics.get("Форм-фактор"),
                    // serias, compatability
                };
            },
        });
    }
}

