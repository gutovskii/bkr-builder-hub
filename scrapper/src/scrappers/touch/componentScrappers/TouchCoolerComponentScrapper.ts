import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchCoolerComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/sistemy-okhlazhdeniya/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'coolerComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    socket: characteristics.get("Сокет"),
                    maxNoiseLevel: characteristics.get("Рівень шуму"),
                    weight: characteristics.get("Вага"),
                    sizes: characteristics.get("Розміри"),
                    tdp: characteristics.get("Тепловиділення (TDP)"),
                };
            },
        });
    }
}