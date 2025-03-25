import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchCaseComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/korpusa/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'caseComponent',
            getAdditionalData: (characteristics) => {
                return {
                    rating: 0,
                    manufacturer: characteristics.get("Бренд"),
                    motherBoardFormFactors: characteristics.get("Підтримка материнських плат"),
                    physicalDimensions: characteristics.get("Розміри"),
                    maxCoolerHeight: characteristics.get("Максимальна висота процесорного кулера"),
                    caseType: characteristics.get("Тип корпусу"),
                    material: characteristics.get("Матеріал корпусу"),
                };
            },
        });
    }
}