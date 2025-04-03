import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";


export class ItboxCaseComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Korpusa-c6563/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'caseComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    rating: 0,
                    manufacturer: characteristics.get("Виробник"),
                    motherBoardFormFactors: characteristics.get("Підтримувані материнські плати"),
                    physicalDimensions: characteristics.get("Розмір, мм"),
                    maxCoolerHeight: (window as any).parseMeasuring(characteristics.get("Максимальна висота процесорного кулера")),
                    caseType: characteristics.get("Типорозмір"),
                    material: characteristics.get("Матеріал корпусу"),
                };
            },
        });
    }
}