import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";

// todo
export class ItboxMotherboardComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Usi_materinski_plati-c3215/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'motherboardComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Виробник"),
                    socket: characteristics.get("Сокет"),
                    formFactor: characteristics.get("Форм-фактор"),
                    chipset: characteristics.get("Модель чіпсета"),
                    memoryType: characteristics.get("Тип оперативної пам'яті"),
                    memoryMax: (window as any).parseMeasuring(characteristics.get("Максимальний об'єм оперативної пам'яті")),
                    memorySlots: (window as any).parseMeasuring(characteristics.get("Кількість роз'ємів оперативної пам'яті").split(' ')[0]),
                    maxFrequencyOfRAM: (window as any).parseMeasuring(characteristics.get("Частота оперативної пам'яті")),
                    // physicalDimensions
                };
            },
        });
    }
}
