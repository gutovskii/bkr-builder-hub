import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";


export class ItboxHddComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Zhorstki_diski-c8373/';
    public currentPage = 2;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'hddComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Виробник"),
                    maxRotationSpeed: (window as any).parseMeasuring(characteristics.get("Швидкість обертання шпинделя")),
                    noiseLevel: (window as any).parseMeasuring(characteristics.get("Рівень шуму")),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    formFactor: characteristics.get("Форм-фактор"),
                    volume: (window as any).parseMeasuring(characteristics.get("Об’єм")),
                    // serias, compatability, physicalDimensions, weight
                };
            },
        });
    }
}