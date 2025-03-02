import { Page } from "puppeteer";
import { AbstractMarketplacesScrapper } from "../AbstractMarketplacesScrapper";
import { getZhukComponentScrappers } from "./getZhukComponentScrappers";

export class ZhukScrapper extends AbstractMarketplacesScrapper {
    protected componentScrappers = getZhukComponentScrappers(this.page);
    
    constructor(private readonly page: Page) {
        super();
    }

    public async scrapMarketplace(): Promise<void> {
        for (const componentScrapper of this.componentScrappers) {
            await componentScrapper.runPaginationScrapping();
        }
    }
}