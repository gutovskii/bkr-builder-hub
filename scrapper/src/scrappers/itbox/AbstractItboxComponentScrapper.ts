import { AbstractComponentScrapper } from "../AbstractComponentScrapper";

export enum ItboxConsts {
    ITBOX_NAME = 'ITbox',
    ITBOX_URL = 'https://www.itbox.ua',
}

export abstract class AbstractItboxComponentScrapper extends AbstractComponentScrapper {
    public shopName = ItboxConsts.ITBOX_NAME;
    protected baseUrl = ItboxConsts.ITBOX_URL;
} 