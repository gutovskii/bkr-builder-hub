import { Browser } from "puppeteer";
import { AbstractMarketplacesScrapper } from "../AbstractMarketplacesScrapper";
import { getTouchComponentScrappers } from "./getTouchComponentScrappers";

export class TouchScrapper extends AbstractMarketplacesScrapper {
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