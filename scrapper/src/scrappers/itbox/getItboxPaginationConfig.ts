import { Page } from "puppeteer";
import { MarketplacePaginationConfig } from "../../common/paginateScrapping";
import { prisma } from "../../prisma";
import { ItboxConsts } from "./AbstractItboxComponentScrapper";

export function getItboxPaginationConfig<TModel>(baseUrl: string, componentPageUrl: string, componentPage: Page): MarketplacePaginationConfig<TModel> {
    return {
        marketplaceName: ItboxConsts.ITBOX_NAME,
        prisma: prisma,
        baseUrl,
        componentPage,
        getComponentsPageUrl: (pageNumber: number) => {
            return pageNumber === 1 ? componentPageUrl : `${componentPageUrl}/page=${pageNumber}`;
        },
        getComponentsHrefs(listPageBody) {
            return listPageBody.evaluate(b => {
                return Array.from(document.querySelectorAll('.items.tablet > .stuff.left:not(out-of-stock) > div > div:first-child')).map(el => el.getAttribute('href'));
            });
        },
        getHasNext(listPageBody) {
            return listPageBody.evaluate(b => {
                const canBtnGoNext = b.querySelector('.next');
                return Boolean(b && canBtnGoNext);
            });
        },
        getScrappedData(componentPageBody, getAdditionalDataStr) {
            return componentPageBody.evaluate((b, getAdditionalDataStr) => {
                const name = b.querySelector('.h1.scada').textContent.trim();
                const price = parseInt(b.querySelector('.stuff-price__digits').textContent.trim().replace(/[^\d]/g, ""), 10);
                const imgUrls = Array.from(new Set(Array.from(
                    document.querySelectorAll('.product-gallery .stuff-img.slick-slide')
                ).map(a => a.attributes.getNamedItem('data-img-big').textContent)));
                const warranty = b.querySelector('.product-warranty-period').textContent.trim();

                if (price === 0) {
                    return null;
                }

                const rows = b.querySelectorAll('tr.filter-url');
                
                let characteristics = new Map<string, string>();

                rows.forEach(row => {
                    const nameElement = row.querySelector('td > span.mr-white');
                    const valueElement = row.querySelector('td:nth-child(2)');

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
                    warranty,
                };

                const getAdditionalData = new Function("return " + getAdditionalDataStr)();

                return {
                    ...basicData,
                    ...getAdditionalData(characteristics, name, price),
                    jsonCharacteristics: JSON.stringify(getAdditionalData(characteristics, name, price)), // todo: wtf,
                };
            }, getAdditionalDataStr);
        },
    }
}