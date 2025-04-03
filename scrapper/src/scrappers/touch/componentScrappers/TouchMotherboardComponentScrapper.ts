import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchMotherboardComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/materinskie-platy/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'motherboardComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Бренд"),
                    socket: characteristics.get("Сокет"),
                    formFactor: characteristics.get("Форм-фактор"),
                    chipset: characteristics.get("Чіпсет"),
                    memoryType: characteristics.get("Тип оперативної пам'яті"),
                    memoryMax: (window as any).parseMeasuring(characteristics.get("Максимальний об'єм оперативної пам'яті")),
                    memorySlots: (window as any).parseMeasuring(characteristics.get("Кількість слотів оперативної пам'яті")),
                    physicalDimensions: characteristics.get("Розміри"),
                    maxFrequencyOfRAM: (window as any).parseMeasuring(characteristics.get("Частота оперативної пам'яті (базова)")),
                };
            },
        });
    }
}