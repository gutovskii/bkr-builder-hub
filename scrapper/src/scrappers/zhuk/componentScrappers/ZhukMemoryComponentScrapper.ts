import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukMemoryComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/operativna-pamyat/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'memoryComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get("Гарантія"),
                    memoryType: characteristics.get("Тип пам'яті"),
                    memoryFrequence: (window as any).parseMeasuring(characteristics.get("Частота пам'яті")),
                    volume: (window as any).parseMeasuring(characteristics.get("Обсяг пам'яті")),
                    numberOfSlots: (window as any).parseMeasuring(characteristics.get("Кількість планок")),
                    timingsSchema: characteristics.get("Схема таймінгів пам'яті"),
                };
            },
        });
    }
}