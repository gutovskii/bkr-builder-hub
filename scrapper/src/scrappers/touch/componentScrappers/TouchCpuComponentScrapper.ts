import { Browser } from "puppeteer";
import { AbstractTouchComponentScrapper, TouchConsts } from "../AbstractTouchComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getTouchPaginationConfig } from "../getTouchPaginationConfig";


export class TouchCpuComponentScrapper 
    extends AbstractTouchComponentScrapper {
    
    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/ua/processory/?PAGEN_1=';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getTouchPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'cpuComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get('Бренд'),
                    socket: characteristics.get('Сокет'),
                    coreCount: (window as any).parseMeasuring(characteristics.get('Кількість ядер')),
                    threadCount: (window as any).parseMeasuring(characteristics.get('Кількість потоків')),
                    tpd: (window as any).parseMeasuring(characteristics.get('Тепловиділення (TDP)')),
                    maxSupportedMemory: (window as any).parseMeasuring(characteristics.get('Максимальний об\'єм оперативної пам\'яті')),
                };
            },
        });
    }
}