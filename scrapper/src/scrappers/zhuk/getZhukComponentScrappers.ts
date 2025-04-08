import { Browser } from "puppeteer";
import { ZhukCaseComponentScrapper, ZhukCoolerComponentScrapper, ZhukCpuComponentScrapper, ZhukHddComponentScrapper, ZhukMemoryComponentScrapper, ZhukMotherboardComponentScrapper, ZhukPowerSupplyComponentScrapper, ZhukSsdComponentScrapper, ZhukVideoCardComponentScrapper } from "./componentScrappers";
import { AbstractZhukComponentScrapper } from "./AbstractZhukComponentScrapper";

export const getZhukComponentScrappers = (browser: Browser): AbstractZhukComponentScrapper[] => [
    new ZhukCpuComponentScrapper(browser),
    new ZhukCaseComponentScrapper(browser),
    new ZhukCoolerComponentScrapper(browser),
    new ZhukHddComponentScrapper(browser),
    new ZhukMemoryComponentScrapper(browser),
    new ZhukMotherboardComponentScrapper(browser),
    new ZhukPowerSupplyComponentScrapper(browser),
    new ZhukVideoCardComponentScrapper(browser),
    new ZhukSsdComponentScrapper(browser),
];