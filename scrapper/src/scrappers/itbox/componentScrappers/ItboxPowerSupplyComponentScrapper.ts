import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";

export class ItboxPowerSupplyComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Bloki_zhivlennya_PK-c6991/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'powerSupplyComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    formFactor: characteristics.get("Форм-фактор"),
                    weight: characteristics.get("Вага"),
                    power: characteristics.get("Потужність"),
                    physicalDimensions: characteristics.get("Розмір, мм"),
                };
            },
        });
    }
}