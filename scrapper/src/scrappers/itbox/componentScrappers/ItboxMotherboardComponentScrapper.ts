import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";
// todo
export class ItboxMotherboardComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Usi_materinski_plati-c3215/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'motherboardComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    socket: characteristics.get("Сокет"),
                    formFactor: characteristics.get("Форм-фактор"),
                    chipset: characteristics.get("Модель чіпсета"),
                    memoryType: characteristics.get("Тип оперативної пам'яті"),
                    memoryMax: characteristics.get("Максимальний об'єм оперативної пам'яті"),
                    memorySlots: characteristics.get("Кількість роз'ємів оперативної пам'яті").split(' ')[0],
                    maxFrequencyOfRAM: characteristics.get("Частота оперативної пам'яті"),
                    // physicalDimensions
                };
            },
        });
    }
}
