import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";


export class ItboxVideoCardComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Videokarti-c3216/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'videoCardComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Виробник"),
                    volume: (window as any).parseMeasuring(characteristics.get("Об'єм вбудованої пам'яті")),
                    chipset: characteristics.get("Графічний чип"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    bitCapacityOfTheMemoryBus: (window as any).parseMeasuring(characteristics.get("Розрядність шини пам'яті")),
                    memoryFrequency: (window as any).parseMeasuring(characteristics.get("Частота пам'яті")),
                    coreFrequency: (window as any).parseMeasuring(characteristics.get("Частота ядра (Boost)")),
                }
            },
        });
    }
}