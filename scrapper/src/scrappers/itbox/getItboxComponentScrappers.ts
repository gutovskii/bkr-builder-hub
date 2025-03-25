import { Page } from "puppeteer";
import { AbstractItboxComponentScrapper } from "./AbstractItboxComponentScrapper";
import { ItboxCaseComponentScrapper, ItboxCpuComponentScrapper, ItboxHddComponentScrapper, ItboxMemoryComponentScrapper, ItboxMotherboardComponentScrapper, ItboxPowerSupplyComponentScrapper, ItboxSsdComponentScrapper, ItboxVideoCardComponentScrapper } from "./componentScrappers";

export const getItboxComponentScrappers = (page: Page): AbstractItboxComponentScrapper[] => [
    new ItboxCpuComponentScrapper(page),
    new ItboxCaseComponentScrapper(page),
    new ItboxHddComponentScrapper(page),
    new ItboxPowerSupplyComponentScrapper(page),
    new ItboxMotherboardComponentScrapper(page),
    new ItboxVideoCardComponentScrapper(page),
    new ItboxSsdComponentScrapper(page),
    new ItboxMemoryComponentScrapper(page),
];