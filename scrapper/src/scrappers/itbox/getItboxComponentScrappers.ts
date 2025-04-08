import { Browser } from "puppeteer";
import { AbstractItboxComponentScrapper } from "./AbstractItboxComponentScrapper";
import { ItboxCaseComponentScrapper, ItboxCpuComponentScrapper, ItboxHddComponentScrapper, ItboxMemoryComponentScrapper, ItboxMotherboardComponentScrapper, ItboxPowerSupplyComponentScrapper, ItboxSsdComponentScrapper, ItboxVideoCardComponentScrapper } from "./componentScrappers";

export const getItboxComponentScrappers = (browser: Browser): AbstractItboxComponentScrapper[] => [
    new ItboxCpuComponentScrapper(browser),
    new ItboxCaseComponentScrapper(browser),
    new ItboxHddComponentScrapper(browser),
    new ItboxPowerSupplyComponentScrapper(browser),
    new ItboxMotherboardComponentScrapper(browser),
    new ItboxVideoCardComponentScrapper(browser),
    new ItboxSsdComponentScrapper(browser),
    new ItboxMemoryComponentScrapper(browser),
];