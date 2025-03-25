import { Page } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";
// todo
export class ItboxCpuComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly componentPage: Page) {
        super(componentPage);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Procesori-c3214/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.componentPage),
            dbModel: 'cpuComponent',
            getAdditionalData: (characteristics) => {
                return {
                    manufacturer: characteristics.get("Виробник"),
                    socket: characteristics.get("Сокет"),
                    coreCount: characteristics.get('Кількість ядер').split(' ')[0],
                    threadCount: characteristics.get('Кількість потоків').split(' ')[0],
                    tpd: characteristics.get('Максимальний TDP'),
                    maxSupportedMemory: characteristics.get('Максимальний обсяг оперативної пам\'яті'),
                };
            },
        });
    }
}

