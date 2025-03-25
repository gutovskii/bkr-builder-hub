import { Page } from "puppeteer";
import { ZhukCaseComponentScrapper, ZhukCoolerComponentScrapper, ZhukCpuComponentScrapper, ZhukHddComponentScrapper, ZhukMemoryComponentScrapper, ZhukMotherboardComponentScrapper, ZhukPowerSupplyComponentScrapper, ZhukSsdComponentScrapper, ZhukVideoCardComponentScrapper } from "./componentScrappers";
import { AbstractZhukComponentScrapper } from "./AbstractZhukComponentScrapper";

export const getZhukComponentScrappers = (page: Page): AbstractZhukComponentScrapper[] => [
    new ZhukCpuComponentScrapper(page),
    new ZhukCaseComponentScrapper(page),
    new ZhukCoolerComponentScrapper(page),
    new ZhukHddComponentScrapper(page),
    new ZhukMemoryComponentScrapper(page),
    new ZhukMotherboardComponentScrapper(page),
    new ZhukPowerSupplyComponentScrapper(page),
    new ZhukVideoCardComponentScrapper(page),
    new ZhukSsdComponentScrapper(page),
];