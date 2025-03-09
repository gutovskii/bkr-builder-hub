import { Page } from "puppeteer";
import { TouchCaseComponentScrapper, TouchCoolerComponentScrapper, TouchCpuComponentScrapper, TouchHddComponentScrapper, TouchMemoryComponentScrapper, TouchMotherboardComponentScrapper, TouchPowerSupplyComponentScrapper, TouchSsdComponentScrapper, TouchVideoCardComponentScrapper } from "./componentScrappers";
import { AbstractTouchComponentScrapper } from "./AbstractTouchComponentScrapper";

export const getTouchComponentScrappers = (page: Page): AbstractTouchComponentScrapper[] => [
    new TouchCpuComponentScrapper(page),
    new TouchCaseComponentScrapper(page),
    new TouchCoolerComponentScrapper(page),
    new TouchHddComponentScrapper(page),
    new TouchMemoryComponentScrapper(page),
    new TouchMotherboardComponentScrapper(page),
    new TouchPowerSupplyComponentScrapper(page),
    new TouchSsdComponentScrapper(page),
    new TouchVideoCardComponentScrapper(page),
];