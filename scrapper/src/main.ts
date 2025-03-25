import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { AbstractMarketplacesScrapper, BuilderHubScrapper, ItboxScrapper, TouchScrapper, ZhukScrapper } from "./scrappers";

export const MARKETPLACES_COUNT = 2;

async function main() {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({ timeout: 0 });

    const page = await browser.newPage();

    const marketplacesScrappers: AbstractMarketplacesScrapper[] = [
        // new TouchScrapper(page),
        // new ItboxScrapper(page),
        new ZhukScrapper(page),
    ];

    const builderHubScrapper = new BuilderHubScrapper(marketplacesScrappers);

    await builderHubScrapper.run();
}

main().catch(e => console.log(e));
