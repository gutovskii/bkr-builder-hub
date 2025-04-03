import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";


export class ItboxPowerSupplyComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Bloki_zhivlennya_PK-c6991/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'powerSupplyComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Виробник"),
                    formFactor: characteristics.get("Форм-фактор"),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    power: (window as any).parseMeasuring(characteristics.get("Потужність")),
                    physicalDimensions: characteristics.get("Розмір, мм"),
                };
            },
        });
    }
}