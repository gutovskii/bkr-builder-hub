import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukHddComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/zhorstki-diski/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'hddComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get("Гарантія"),
                    formFactor: characteristics.get("Форм-фактор"),
                    maxRotationSpeed: (window as any).parseMeasuring(characteristics.get("Швидкість обертання шпинделя")),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    physicalDimensions: characteristics.get("Розміри"),
                    noiseLevel: (window as any).parseMeasuring(characteristics.get("Максимальний рівень шуму")),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    writingTechnology: characteristics.get("Тип конектора живлення"),
                    volume: (window as any).parseMeasuring(characteristics.get("Місткість накопичувача")),
                    // serias
                };
            },
        });
    }
}