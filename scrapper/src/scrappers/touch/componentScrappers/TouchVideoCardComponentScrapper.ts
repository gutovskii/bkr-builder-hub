import { Page } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";

export class TouchVideoCardComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/videokarty/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'videoCardComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Бренд"),
                    volume: characteristics.get("Об'єм пам'яті відеокарти"),
                    chipset: characteristics.get("Графічний чип"),
                    connectionInterface: characteristics.get("Інтерфейс підключення"),
                    bitCapacityOfTheMemoryBus: characteristics.get("Розрядність шини пам'яті"),
                    memoryFrequency: characteristics.get("Частота роботи пам'яті"),
                    coreFrequency: characteristics.get("Частота роботи графічного чипу"),
                    connectors: characteristics.get("Кількість займаних слотів"),
                }
            },
        });
    }
}