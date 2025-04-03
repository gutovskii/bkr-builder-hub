import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukCoolerComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/sistemi-okholodzhennya-dlya-pk/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'coolerComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get("Гарантія"),
                    sizes: characteristics.get("Додатково"),
                    maxNoiseLevel: (window as any).parseMeasuring(characteristics.get("Максимальний рівень шуму")),
                    socket: characteristics.get("Сокет"),
                    tdp: (window as any).parseMeasuring(characteristics.get("Максимальний TDP")),
                    weight: (window as any).parseMeasuring(characteristics.get("Вага")),
                };
            },
        });
    }
}