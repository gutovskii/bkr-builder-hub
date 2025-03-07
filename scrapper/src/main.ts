import puppeteer from "puppeteer";
import { AbstractMarketplacesScrapper, BuilderHubScrapper, TouchScrapper, ZhukScrapper } from "./scrappers";

export const MARKETPLACES_COUNT = 2;

async function main() {
    const browser = await puppeteer.launch({ headless: true, timeout: 0 });

    const page = await browser.newPage();

    const marketplacesScrappers: AbstractMarketplacesScrapper[] = [
        new TouchScrapper(page),
        new ZhukScrapper(page),
    ];

    const builderHubScrapper = new BuilderHubScrapper(marketplacesScrappers);

    await builderHubScrapper.run();
}

main().catch(e => console.log(e));
