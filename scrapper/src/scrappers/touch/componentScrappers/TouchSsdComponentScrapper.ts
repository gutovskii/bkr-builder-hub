import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchSsdComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/SSD-nakopiteli-kompl/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'ssdComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Бренд"),
                    volume: (window as any).parseMeasuring(characteristics.get("Об'єм накопичувача")),
                    readingSpeed: (window as any).parseMeasuring(characteristics.get("Швидкість читання")),
                    writingSpeed: (window as any).parseMeasuring(characteristics.get("Швидкість запису")),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    physicalDimensions: characteristics.get("Розміри"),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    formFactor: characteristics.get("Форм-фактор"),
                    // serias, compatability
                };
            },
        });
    }
}