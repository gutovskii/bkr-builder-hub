import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";


export class ItboxSsdComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/SSD_diski-c6861/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'ssdComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Виробник"),
                    volume: (window as any).parseMeasuring(characteristics.get("Об'єм пам'яті")),
                    readingSpeed: (window as any).parseMeasuring(characteristics.get("Швидкість читання")),
                    writingSpeed: (window as any).parseMeasuring(characteristics.get("Швидкість запису")),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    physicalDimensions: characteristics.get("Габарити"),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    formFactor: characteristics.get("Форм-фактор"),
                    // serias, compatability
                };
            },
        });
    }
}

