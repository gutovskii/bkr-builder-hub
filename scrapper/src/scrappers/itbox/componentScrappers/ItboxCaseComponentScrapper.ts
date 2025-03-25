import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";

export class ItboxCaseComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Korpusa-c6563/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'caseComponent',
            getAdditionalData: (characteristics) => {
                return {
                    rating: 0,
                    manufacturer: characteristics.get("Виробник"),
                    motherBoardFormFactors: characteristics.get("Підтримувані материнські плати"),
                    physicalDimensions: characteristics.get("Розмір, мм"),
                    maxCoolerHeight: characteristics.get("Максимальна висота процесорного кулера"),
                    caseType: characteristics.get("Типорозмір"),
                    material: characteristics.get("Матеріал корпусу"),
                };
            },
        });
    }
}