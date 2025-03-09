import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchMotherboardComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/materinskie-platy/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'motherboardComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    socket: characteristics.get("Сокет"),
                    formFactor: characteristics.get("Форм-фактор"),
                    chipset: characteristics.get("Чіпсет"),
                    memoryType: characteristics.get("Тип оперативної пам'яті"),
                    memoryMax: characteristics.get("Максимальний об'єм оперативної пам'яті"),
                    memorySlots: characteristics.get("Кількість слотів оперативної пам'яті"),
                    physicalDimensions: characteristics.get("Розміри"),
                    maxFrequencyOfRAM: characteristics.get("Частота оперативної пам'яті (базова)"),
                };
            },
        });
    }
}