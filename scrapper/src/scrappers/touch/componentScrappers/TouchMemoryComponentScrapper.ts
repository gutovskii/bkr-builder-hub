import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchMemoryComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/operativnaya-pamyat/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'memoryComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    memoryType: characteristics.get("Форм-фактор"),
                    memoryFrequence: characteristics.get("Частота пам'яті"),
                    volume: characteristics.get("Об'єм оперативної пам'яті"),
                    numberOfSlots: characteristics.get("Кількість планок"),
                    timingsSchema: characteristics.get("Формула таймінгів"),
                };
            },
        });
    }
}