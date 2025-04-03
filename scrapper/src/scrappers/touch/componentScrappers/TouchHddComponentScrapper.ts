import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchHddComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/zhestkie-diski-kompl/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'hddComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Бренд"),
                    maxRotationSpeed: (window as any).parseMeasuring(characteristics.get("Максимальна швидкість обертання")),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    physicalDimensions: characteristics.get("Розміри"),
                    noiseLevel: (window as any).parseMeasuring(characteristics.get("Рівень шуму")),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    writingTechnology: characteristics.get("Технологія запису"),
                    formFactor: characteristics.get("Форм-фактор"),
                    volume: (window as any).parseMeasuring(characteristics.get("Об'єм накопичувача")),
                    // serias, compatability
                };
            },
        });
    }
}