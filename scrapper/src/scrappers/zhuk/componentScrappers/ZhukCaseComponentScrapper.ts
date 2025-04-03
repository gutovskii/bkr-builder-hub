import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukCaseComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/korpusi-dlya-pk/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'caseComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    maxVideoCardLength: (window as any).parseMeasuring(characteristics.get("Максимальна довжина відеокарти")),
                    motherBoardFormFactors: characteristics.get("Форм-фактор материнської плати"),
                    physicalDimensions: characteristics.get("Габарити"),
                    maxCoolerHeight: (window as any).parseMeasuring(characteristics.get("Максимальна висота кулера ЦП")),
                    caseType: characteristics.get("Тип корпуса"),
                    material: characteristics.get("Матеріал"),
                };
            },
        });
    }
}