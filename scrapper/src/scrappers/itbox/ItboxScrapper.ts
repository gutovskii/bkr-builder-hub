import { Browser } from "puppeteer";
import { AbstractMarketplacesScrapper } from "../AbstractMarketplacesScrapper";
import { getItboxComponentScrappers } from "./getItboxComponentScrappers";

export class ItboxScrapper extends AbstractMarketplacesScrapper {
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