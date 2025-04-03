import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukSsdComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/vnutrishniy-ssd/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'ssdComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get('Гарантія'),
                    volume: (window as any).parseMeasuring(characteristics.get("Місткість накопичувача")),
                    readingSpeed: (window as any).parseMeasuring(characteristics.get("Максимальна швидкість читання")),
                    writingSpeed: (window as any).parseMeasuring(characteristics.get("Максимальна швидкість запису")),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    physicalDimensions: characteristics.get("Розміри"),
                    formFactor: characteristics.get("Форм-фактор"),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                    // serias
                };
            },
        });
    }
}