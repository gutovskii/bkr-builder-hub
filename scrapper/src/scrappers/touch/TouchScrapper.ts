import { Page } from "puppeteer";
import { AbstractMarketplacesScrapper } from "../AbstractMarketplacesScrapper";
import { getTouchComponentScrappers } from "./getTouchComponentScrappers";

export class TouchScrapper extends AbstractMarketplacesScrapper {
    protected componentScrappers = getTouchComponentScrappers(this.page);

    constructor(private readonly page: Page) {
        super();
    }

    public async scrapMarketplace(): Promise<void> {
        for (const componentScrapper of this.componentScrappers) {
            await componentScrapper.runPaginationScrapping();
        }
    }
}