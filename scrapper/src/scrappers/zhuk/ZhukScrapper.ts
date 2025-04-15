import { Browser } from "puppeteer";
import { AbstractMarketplaceScrapper } from "../AbstractMarketplaceScrapper";
import { getZhukComponentScrappers } from "./getZhukComponentScrappers";

export class ZhukScrapper extends AbstractMarketplaceScrapper {
    protected componentScrappers = getZhukComponentScrappers(this.browser);
    
    constructor(private readonly browser: Browser) {
        super();
    }

    public async scrapMarketplace(): Promise<void> {
        for (const componentScrapper of this.componentScrappers) {
            await componentScrapper.runPaginationScrapping();
        }
    }
}