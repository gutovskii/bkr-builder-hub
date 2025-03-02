import { AbstractComponentScrapper } from "./AbstractComponentScrapper";

export abstract class AbstractMarketplacesScrapper {
    protected abstract componentScrappers: AbstractComponentScrapper[];
    public abstract scrapMarketplace(): Promise<void>;
}