import { Browser } from "puppeteer";
import { TouchCaseComponentScrapper, TouchCoolerComponentScrapper, TouchCpuComponentScrapper, TouchHddComponentScrapper, TouchMemoryComponentScrapper, TouchMotherboardComponentScrapper, TouchPowerSupplyComponentScrapper, TouchSsdComponentScrapper, TouchVideoCardComponentScrapper } from "./componentScrappers";
import { AbstractTouchComponentScrapper } from "./AbstractTouchComponentScrapper";

export const getTouchComponentScrappers = (browser: Browser): AbstractTouchComponentScrapper[] => [
    new TouchCpuComponentScrapper(browser),
    new TouchCaseComponentScrapper(browser),
    new TouchCoolerComponentScrapper(browser),
    new TouchHddComponentScrapper(browser),
    new TouchMemoryComponentScrapper(browser),
    // new TouchMotherboardComponentScrapper(browser),
    // new TouchPowerSupplyComponentScrapper(browser),
    // new TouchSsdComponentScrapper(browser),
    // new TouchVideoCardComponentScrapper(browser),
];