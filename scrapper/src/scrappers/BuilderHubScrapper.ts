import { AbstractMarketplacesScrapper } from "./AbstractMarketplacesScrapper";

export class BuilderHubScrapper {
    constructor(private readonly marketplacesScrappers: AbstractMarketplacesScrapper[]) {}

    public async run() {
        for (const marketplaceScrapper of this.marketplacesScrappers) {
            await marketplaceScrapper.scrapMarketplace();
        }
    }
}