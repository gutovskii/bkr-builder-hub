import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchCaseComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/korpusa/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
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
                    manufacturer: characteristics.get("Бренд"),
                    motherBoardFormFactors: characteristics.get("Підтримка материнських плат"),
                    physicalDimensions: characteristics.get("Розміри"),
                    maxCoolerHeight: (window as any).parseMeasuring(characteristics.get("Максимальна висота процесорного кулера")),
                    caseType: characteristics.get("Тип корпусу"),
                    material: characteristics.get("Матеріал корпусу"),
                };
            },
        });
    }
}