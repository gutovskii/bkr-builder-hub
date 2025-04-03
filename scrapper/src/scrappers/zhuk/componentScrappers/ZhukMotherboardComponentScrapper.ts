import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukMotherboardComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    componentBaseUrl = this.baseUrl + '/materinski-plati/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'motherboardComponent',
            getAdditionalData: (characteristics, _, name) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    warranty: characteristics.get("Гарантія"),
                    socket: characteristics.get("Сокет"),
                    formFactor: characteristics.get("Форм-фактор"),
                    chipset: characteristics.get("Чипсет (Північний міст)"),
                    memoryType: characteristics.get("Підтримувані типи пам'яті"),
                    memoryMax: (window as any).parseMeasuring(characteristics.get("Максимальний обсяг ОЗУ")),
                    memorySlots: (window as any).parseMeasuring(characteristics.get("Кількість слотів оперативної пам'яті")),
                    physicalDimensions: characteristics.get("Розміри плати"),
                    maxFrequencyOfRAM: (window as any).parseMeasuring(characteristics.get("Максимальна частота ОЗУ")),
                };
            },
        });
    }
}