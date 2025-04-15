import { Browser } from "puppeteer";
import { AbstractMarketplaceScrapper } from "../AbstractMarketplaceScrapper";
import { getTouchComponentScrappers } from "./getTouchComponentScrappers";

export class TouchScrapper extends AbstractMarketplaceScrapper {
    protected componentScrappers = getTouchComponentScrappers(this.browser);

    constructor(private readonly browser: Browser) {
        super();
    }

    public async scrapMarketplace(): Promise<void> {
        for (const componentScrapper of this.componentScrappers) {
            await componentScrapper.runPaginationScrapping();
        }
    }
}