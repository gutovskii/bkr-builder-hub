import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukHddComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/zhorstki-diski/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'hddComponent',
            getAdditionalData(characteristics, name) {
                return {
                    manufacturer: name.split(' ')[1],
                    warranty: characteristics.get("Гарантія"),
                    formFactor: characteristics.get("Форм-фактор"),
                    maxRotationSpeed: characteristics.get("Швидкість обертання шпинделя"),
                    weight: characteristics.get("Вага"),
                    physicalDimensions: characteristics.get("Розміри"),
                    noiseLevel: characteristics.get("Максимальний рівень шуму"),
                    connectionInterface: characteristics.get("Інтерфейс"),
                    writingTechnology: characteristics.get("Тип конектора живлення"),
                    // serias
                };
            },
        });
    }
}