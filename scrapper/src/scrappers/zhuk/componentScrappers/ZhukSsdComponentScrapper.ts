import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukSsdComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/vnutrishniy-ssd/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'ssdComponent',
            getAdditionalData: (characteristics, name) => {
                return {
                    manufacturer: name.split(' ')[1],
                    warranty: characteristics.get('Гарантія'),
                    volume: characteristics.get("Місткість накопичувача"),
                    readingSpeed: characteristics.get("Максимальна швидкість читання"),
                    writingSpeed: characteristics.get("Максимальна швидкість запису"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    physicalDimensions: characteristics.get("Розміри"),
                    formFactor: characteristics.get("Форм-фактор"),
                    weight: characteristics.get("Вага"),
                    // serias
                };
            },
        });
    }
}