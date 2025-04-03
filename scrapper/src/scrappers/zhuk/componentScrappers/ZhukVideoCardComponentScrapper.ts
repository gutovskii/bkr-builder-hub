import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukVideoCardComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/videokarti/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'videoCardComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get("Гарантія"),
                    volume: (window as any).parseMeasuring(characteristics.get("Обсяг пам'яті")),
                    memoryType: characteristics.get("Тип пам'яті"),
                    chipset: characteristics.get("Графічний чіп"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    bitCapacityOfTheMemoryBus: (window as any).parseMeasuring(characteristics.get("Розрядність шини пам'яті")),
                    memoryFrequency: (window as any).parseMeasuring(characteristics.get("Частота пам'яті")),
                    coreFrequency: (window as any).parseMeasuring(characteristics.get("Частота ядра")),
                    connectors: (window as any).parseMeasuring(characteristics.get("Кількість займаних слотів")),
                };
            },
        });
    }
}