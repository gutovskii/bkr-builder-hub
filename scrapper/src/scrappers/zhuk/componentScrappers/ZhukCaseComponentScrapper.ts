import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukCaseComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/korpusi-dlya-pk/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'caseComponent',
            getAdditionalData: (characteristics, name) => {
                return {
                    manufacturer: name.split(' ')[1],
                    maxVideoCardLength: characteristics.get("Максимальна довжина відеокарти"),
                    motherBoardFormFactors: characteristics.get("Форм-фактор материнської плати"),
                    physicalDimensions: characteristics.get("Габарити"),
                    maxCoolerHeight: characteristics.get("Максимальна висота кулера ЦП"),
                    caseType: characteristics.get("Тип корпуса"),
                    material: characteristics.get("Матеріал"),
                };
            },
        });
    }
}