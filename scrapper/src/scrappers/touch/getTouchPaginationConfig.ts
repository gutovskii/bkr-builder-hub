import { Page } from "puppeteer";
import { MarketplacePaginationConfig } from "../../common/paginateScrapping";
import { prisma } from "../../prisma";
import { TouchConsts } from "./AbstractTouchComponentScrapper";

export function getTouchPaginationConfig<TModel>(baseUrl: string, componentPage: Page): MarketplacePaginationConfig<TModel> {
    return {
        marketplaceName: TouchConsts.TOUCH_NAME,
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
        getScrappedData(componentPageBody, getAdditionalData) {
            return componentPageBody.evaluate((b, getAdditionalData) => {
                const name = b.querySelector('.changeName').textContent.trim();
                const price = parseInt(b.querySelector('.changePrice').textContent.trim().replace(/[^\d]/g, ""), 10);
                const imgUrls = Array.from(
                    document.querySelectorAll('.pictureSlider div a')
                ).map(a => document.location.origin + a.attributes.getNamedItem('href').textContent);

                if (price === 0) {
                    return null;
                }

                const rows = b.querySelectorAll('tr.row_gray, tr.row_white');
                
                let characteristics = new Map<string, string>();

                rows.forEach(row => {
                    const nameElement = row.querySelector('.cell_name span');
                    const valueElement = row.querySelector('.cell_value span');

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
                    rating: 0,
                    warrany: characteristics.get('Гарантійний термін')
                }

                return {
                    ...basicData,
                    ...getAdditionalData(characteristics, name, price),
                };
            }, getAdditionalData);
        },
    }
}