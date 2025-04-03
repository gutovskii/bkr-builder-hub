import { Browser } from "puppeteer";
import { MarketplacePaginationConfig } from "../../common/paginateScrapping";
import { prisma } from "../../prisma";
import { ZhukConsts } from "./AbstractZhukComponentScrapper";

export function getZhukPaginationConfig<TModel>(baseUrl: string, componentPageUrl: string, browser: Browser): MarketplacePaginationConfig<TModel> {
    return {
        marketplaceName: ZhukConsts.ZHUK_NAME,
        prisma: prisma,
        baseUrl,
        browser,
        getComponentsPageUrl: (pageNumber: number) => {
            return pageNumber === 1 ? componentPageUrl : `${componentPageUrl}filter/page=${pageNumber}/`;
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
        getScrappedData(componentPageBody, getAdditionalDataStr) {
            return componentPageBody.evaluate((b, getAdditionalDataStr) => {
                const name = b.querySelector('.product-title').textContent.trim();
                const price = parseInt(b.querySelector('.product-price__item').textContent.trim().replace(/[^\d]/g, ""), 10);
                const imgUrls = Array.from(
                    b.querySelectorAll('.gallery__photos-list span img')
                ).map(a => document.location.origin + a.attributes.getNamedItem('src').textContent);

                if (price === 0) {
                    return null;
                }

                const rows = b.querySelectorAll('.product-features__row');
                let characteristics = new Map<string, string>();

                rows.forEach(row => {
                    const nameElement = row.querySelector('.product-features__cell:first-child');
                    const valueElement = row.querySelector('.product-features__cell:last-child');

                    if (nameElement && valueElement) {
                        characteristics.set(
                            nameElement.textContent.trim(),
                            valueElement.textContent.trim(),
                        );
                    }
                });

                const basicData = {
                    name,
                    price,
                    imgUrls,
                    rating: 0, // Todo: add rating somehow
                    warranty: characteristics.get("Гарантія"),
                };

                const getAdditionalData = new Function("return " + getAdditionalDataStr)();
                
                return {
                    ...basicData,
                    ...getAdditionalData(characteristics, name, price),
                    jsonCharacteristics: JSON.stringify(
                        Object.entries(getAdditionalData(characteristics, name, price) as Record<string, string | number>)
                            .map(([key, value]) => (value === null ? null : [key, value])) // Map to either null or key-value pair
                            .filter(Boolean) // Remove null entries
                            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
                    ), // todo: wtf,
                };
            }, getAdditionalDataStr);
        }
    }
}