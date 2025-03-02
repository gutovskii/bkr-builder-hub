import { Page } from "puppeteer";
import { ZhukCpuComponentScrapper } from "./componentScrappers";
import { AbstractZhukComponentScrapper } from "./AbstractZhukComponentScrapper";

export const getZhukComponentScrappers = (page: Page): AbstractZhukComponentScrapper[] => [
    new ZhukCpuComponentScrapper(page)
];