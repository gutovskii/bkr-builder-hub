import { Page } from "puppeteer";
import { TouchCpuComponentScrapper } from "./componentScrappers";
import { AbstractTouchComponentScrapper } from "./AbstractTouchComponentScrapper";

export const getTouchComponentScrappers = (page: Page): AbstractTouchComponentScrapper[] => [
    new TouchCpuComponentScrapper(page)
];