import { Browser } from "puppeteer";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getItboxPaginationConfig } from "../getItboxPaginationConfig";
import { AbstractItboxComponentScrapper } from "../AbstractItboxComponentScrapper";

// todo
export class ItboxCpuComponentScrapper 
    extends AbstractItboxComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/category/Procesori-c3214/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getItboxPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'cpuComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Виробник"),
                    socket: characteristics.get("Сокет"),
                    coreCount: (window as any).parseMeasuring(characteristics.get('Кількість ядер').split(' ')[0]),
                    threadCount: (window as any).parseMeasuring(characteristics.get('Кількість потоків').split(' ')[0]),
                    tpd: (window as any).parseMeasuring(characteristics.get('Максимальний TDP')),
                    maxSupportedMemory: (window as any).parseMeasuring(characteristics.get('Максимальний обсяг оперативної пам\'яті')),
                };
            },
        });
    }
}

