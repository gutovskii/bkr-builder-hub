import { AbstractComponentScrapper } from "../AbstractComponentScrapper";

export enum TouchConsts {
    TOUCH_NAME = 'Touch',
    TOUCH_URL = 'https://touch.com.ua',
}

export abstract class AbstractTouchComponentScrapper extends AbstractComponentScrapper {
    public shopName = TouchConsts.TOUCH_NAME;
    protected baseUrl = TouchConsts.TOUCH_URL;
}