import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchSsdComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/SSD-nakopiteli-kompl/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'ssdComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    volume: characteristics.get("Об'єм накопичувача"),
                    readingSpeed: characteristics.get("Швидкість читання"),
                    writingSpeed: characteristics.get("Швидкість запису"),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    physicalDimensions: characteristics.get("Розміри"),
                    weight: characteristics.get("Вага"),
                    formFactor: characteristics.get("Форм-фактор"),
                    // serias, compatability
                };
            },
        });
    }
}