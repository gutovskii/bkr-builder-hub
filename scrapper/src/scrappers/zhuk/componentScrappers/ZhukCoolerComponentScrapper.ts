import { Page } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";

export class ZhukCoolerComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    componentBaseUrl = this.baseUrl + '/sistemi-okholodzhennya-dlya-pk/';
    currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentPage),
            dbModel: 'coolerComponent',
            getAdditionalData(characteristics, name) {
                return {
                    manufacturer: name.split(' ')[1],
                    warranty: characteristics.get("Гарантія"),
                    sizes: characteristics.get("Додатково"),
                    maxNoiseLevel: characteristics.get("Максимальний рівень шуму"),
                    socket: characteristics.get("Сокет"),
                    tdp: characteristics.get("Максимальний TDP"),
                    weight: characteristics.get("Вага"),
                };
            },
        });
    }
}