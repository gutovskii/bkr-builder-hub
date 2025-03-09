import { Page } from "puppeteer";
import { MarketplacePaginationConfig } from "../../common/paginateScrapping";
import { prisma } from "../../prisma";
import { ZhukConsts } from "./AbstractZhukComponentScrapper";

export function getZhukPaginationConfig<TModel>(baseUrl: string, componentPage: Page): MarketplacePaginationConfig<TModel> {
    return {
        marketplaceName: ZhukConsts.ZHUK_NAME,
        prisma: prisma,
        baseUrl,
        componentPage,
        getComponentsPageUrl: (pageNumber: number) => {
            return pageNumber === 1 ? this.componentBaseUrl : `${this.componentBaseUrl}filter/page=${pageNumber}/`;
        },
        getComponentsHrefs(listPageBody) {
            return listPageBody.evaluate(b => {
                return Array.from(b.querySelectorAll('.catalogGrid.catalog-grid li meta:last-child')).map((meta: any) => meta.content);
            })
        },
        getHasNext(listPageBody) {
            return listPageBody.evaluate(b => {
                const canBtnGoNext = !b.querySelector('.pager__item--forth').classList.contains('is-disabled');
                return Boolean(b && canBtnGoNext);
            })
        },
    }
}