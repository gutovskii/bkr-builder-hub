import { Page } from "puppeteer";
import { AbstractMarketplacesScrapper } from "../AbstractMarketplacesScrapper";
import { getItboxComponentScrappers } from "./getItboxComponentScrappers";

export class ItboxScrapper extends AbstractMarketplacesScrapper {
    protected componentScrappers = getItboxComponentScrappers(this.page);

    constructor(private readonly page: Page) {
        super();
    }

    public async scrapMarketplace(): Promise<void> {
        for (const componentScrapper of this.componentScrappers) {
            await componentScrapper.runPaginationScrapping();
        }
    }
}