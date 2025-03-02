import { AbstractComponentScrapper } from "../AbstractComponentScrapper";

export enum ZhukConsts {
    ZHUK_NAME = 'Zhuk',
    ZHUK_URL = 'https://zhuk.ua',
}

export abstract class AbstractZhukComponentScrapper extends AbstractComponentScrapper {
    public shopName = ZhukConsts.ZHUK_NAME;
    protected baseUrl = ZhukConsts.ZHUK_URL;
}