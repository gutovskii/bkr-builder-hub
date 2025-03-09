import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchPowerSupplyComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/bloki-pitaniya/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'powerSupplyComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    formFactor: characteristics.get("Форм-фактор"),
                    weight: characteristics.get("Вага"),
                    power: characteristics.get("Потужність"),
                    physicalDimensions: characteristics.get("Розміри"),
                    specification: characteristics.get("Специфікація"),
                };
            },
        });
    }
}