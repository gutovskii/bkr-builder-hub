import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukPowerSupplyComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/bloki-zhivlennya/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'powerSupplyComponent',
            getAdditionalData: (characteristics, name) => {
                return {
                    warranty: characteristics.get("Гарантія"),
                    weight: characteristics.get(""),
                    power: characteristics.get("Потужність"),
                    physicalDimensions: characteristics.get("Габарити"),
                    specification: characteristics.get("Особливості"),
                };
            },
        });
    }
}