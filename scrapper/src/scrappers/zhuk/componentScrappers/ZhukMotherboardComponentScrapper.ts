import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukMotherboardComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/materinski-plati/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'motherboardComponent',
            getAdditionalData(characteristics, name) {
                return {
                    manufacturer: name.split(' ')[2],
                    warranty: characteristics.get("Гарантія"),
                    socket: characteristics.get("Сокет"),
                    formFactor: characteristics.get("Форм-фактор"),
                    chipset: characteristics.get("Чипсет (Північний міст)"),
                    memoryType: characteristics.get("Підтримувані типи пам'яті"),
                    memoryMax: characteristics.get("Максимальний обсяг ОЗУ"),
                    memorySlots: characteristics.get("memorySlots"),
                    physicalDimensions: characteristics.get("Розміри плати"),
                    maxFrequencyOfRAM: characteristics.get("Максимальна частота ОЗУ"),
                };
            },
        });
    }
}