import { AbstractMarketplaceScrapper } from "./AbstractMarketplaceScrapper";

export class BuilderHubScrapper {
    constructor(private readonly marketplacesScrappers: AbstractMarketplaceScrapper[]) {}

    public async run() {
        for (const marketplaceScrapper of this.marketplacesScrappers) {
            await marketplaceScrapper.scrapMarketplace();
        }
    }
}