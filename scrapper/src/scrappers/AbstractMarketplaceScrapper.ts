import { AbstractComponentScrapper } from "./AbstractComponentScrapper";

export abstract class AbstractMarketplaceScrapper {
    protected abstract componentScrappers: AbstractComponentScrapper[];
    public abstract scrapMarketplace(): Promise<void>;
}