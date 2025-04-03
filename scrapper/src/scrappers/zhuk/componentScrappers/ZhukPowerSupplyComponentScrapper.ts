import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukPowerSupplyComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/bloki-zhivlennya/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'powerSupplyComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get("Гарантія"),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    power: (window as any).parseMeasuring(characteristics.get("Потужність")),
                    physicalDimensions: characteristics.get("Габарити"),
                    specification: characteristics.get("Особливості"),
                };
            },
        });
    }
}