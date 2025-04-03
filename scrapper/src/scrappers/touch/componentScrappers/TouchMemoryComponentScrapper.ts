import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchMemoryComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/operativnaya-pamyat/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'memoryComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Бренд"),
                    memoryType: characteristics.get("Форм-фактор"),
                    memoryFrequence: (window as any).parseMeasuring(characteristics.get("Частота пам'яті")),
                    volume: (window as any).parseMeasuring(characteristics.get("Об'єм оперативної пам'яті")),
                    numberOfSlots: (window as any).parseMeasuring(characteristics.get("Кількість планок")),
                    timingsSchema: characteristics.get("Формула таймінгів"),
                };
            },
        });
    }
}