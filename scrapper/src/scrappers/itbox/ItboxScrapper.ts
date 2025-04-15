import { Browser } from "puppeteer";
import { AbstractMarketplaceScrapper } from "../AbstractMarketplaceScrapper";
import { getItboxComponentScrappers } from "./getItboxComponentScrappers";

export class ItboxScrapper extends AbstractMarketplaceScrapper {
    protected componentScrappers = getItboxComponentScrappers(this.browser);

    constructor(private readonly browser: Browser) {
        super();
    }

    public async scrapMarketplace(): Promise<void> {
        for (const componentScrapper of this.componentScrappers) {
            await componentScrapper.runPaginationScrapping();
        }
    }
}