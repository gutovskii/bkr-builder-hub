import { Browser } from "puppeteer";

export abstract class AbstractComponentScrapper {
    public abstract shopName: string;

    protected abstract baseUrl: string;
    protected abstract componentBaseUrl: string;
    protected abstract currentPage: number;

    public constructor(_: Browser) {}

    public abstract runPaginationScrapping(): Promise<void>;
}