import puppeteer from "puppeteer";
import { AbstractMarketplaceScrapper, BuilderHubScrapper, ItboxScrapper, TouchScrapper, ZhukScrapper } from "./scrappers";

export const MARKETPLACES_COUNT = 3;

async function main() {
    const browser = await puppeteer.launch({ timeout: 0 });

    const marketplacesScrappers: AbstractMarketplaceScrapper[] = [
        new TouchScrapper(browser),
        new ZhukScrapper(browser),
        new ItboxScrapper(browser),
    ];

    const builderHubScrapper = new BuilderHubScrapper(marketplacesScrappers);

    await builderHubScrapper.run();
}

main().catch(e => console.log(e));
