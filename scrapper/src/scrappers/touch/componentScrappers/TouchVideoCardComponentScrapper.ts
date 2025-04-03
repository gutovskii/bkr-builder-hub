import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchVideoCardComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/videokarty/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'videoCardComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Бренд"),
                    volume: (window as any).parseMeasuring(characteristics.get("Об'єм пам'яті відеокарти")),
                    chipset: characteristics.get("Графічний чип"),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    bitCapacityOfTheMemoryBus: (window as any).parseMeasuring(characteristics.get("Розрядність шини пам'яті")),
                    memoryFrequency: (window as any).parseMeasuring(characteristics.get("Частота роботи пам'яті")),
                    coreFrequency: (window as any).parseMeasuring(characteristics.get("Частота роботи графічного чипу")),
                    connectors: (window as any).parseMeasuring(characteristics.get("Кількість займаних слотів")),
                }
            },
        });
    }
}