import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchHddComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/zhestkie-diski-kompl/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'hddComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    maxRotationSpeed: characteristics.get("Максимальна швидкість обертання"),
                    weight: characteristics.get("Вага"),
                    physicalDimensions: characteristics.get("Розміри"),
                    noiseLevel: characteristics.get("Рівень шуму"),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    writingTechnology: characteristics.get("Технологія запису"),
                    formFactor: characteristics.get("Форм-фактор"),
                    // serias, compatability
                };
            },
        });
    }
}