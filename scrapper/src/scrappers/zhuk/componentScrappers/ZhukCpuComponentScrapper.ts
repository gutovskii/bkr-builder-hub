import { Browser } from "puppeteer";
import { AbstractZhukComponentScrapper } from "../AbstractZhukComponentScrapper";
import { paginateScrapping } from "../../../common/paginateScrapping";
import { getZhukPaginationConfig } from "../getZhukPaginationConfig";


export class ZhukCpuComponentScrapper
    extends AbstractZhukComponentScrapper {

    constructor(private readonly browser: Browser) {
        super(browser);
    }

    public componentBaseUrl = this.baseUrl + '/protsesori/';
    public currentPage = 1;

    async runPaginationScrapping(): Promise<void> {
        await paginateScrapping({
            ...getZhukPaginationConfig(this.baseUrl, this.componentBaseUrl, this.browser),
            dbModel: 'cpuComponent',
            getAdditionalData: (characteristics) => {
                (window as any).parseMeasuring = (value: string | null | undefined): number | null => {
                    if (!value) return null;
                    
                    const regexpResult = value.replace(/,/g, '.').match(/\d+(\.\d+)?/);
                    if (!regexpResult) return null;
                    
                    return value ? Number(regexpResult[0]) : null;
                }
                return {
                    manufacturer: characteristics.get("Сімейство процесорів").split(" ")[0],
                    warranty: characteristics.get("Гарантія"),
                    socket: characteristics.get("Тип роз'єму"),
                    coreCount: (window as any).parseMeasuring(characteristics.get("Кількість ядер")),
                    threadCount: (window as any).parseMeasuring(characteristics.get("Кількість потоків")),
                    tpd: (window as any).parseMeasuring(characteristics.get("Потужність TDP")),
                    maxSupportedMemory: (window as any).parseMeasuring(characteristics.get("Максимальний об'єм пам'яті")),
                };
            },
        });
    }
}