import { Page } from "puppeteer";
import { MarketplacePaginationConfig } from "../../common/paginateScrapping";
import { prisma } from "../../prisma";
import { TouchConsts } from "./AbstractTouchComponentScrapper";

export function getTouchPaginationConfig<TModel>(baseUrl: string, componentPageUrl: string, componentPage: Page): MarketplacePaginationConfig<TModel> {
    return {
        marketplaceName: TouchConsts.TOUCH_NAME,
        prisma: prisma,
        baseUrl,
        componentPage,
        getComponentsPageUrl: (pageNumber: number) => {
            return componentPageUrl + pageNumber;
        },
        getComponentsHrefs(listPageBody) {
            return listPageBody.evaluate(b => {
                return Array.from(b.querySelectorAll('.items.productList .tabloid .name')).map(el => el.getAttribute('href'));
            });
        },
        getHasNext(listPageBody) {
            return listPageBody.evaluate(b => {
                const canBtnGoNext = b.querySelector('.bx-pag-next a')?.attributes?.getNamedItem('onclick');
                return Boolean(b && canBtnGoNext);
            });
        },
        getScrappedData(componentPageBody, getAdditionalDataStr) {
            return componentPageBody.evaluate((b, getAdditionalDataStr) => {
                const name = b.querySelector('.changeName').textContent.trim();
                const price = parseInt(b.querySelector('.changePrice').textContent.trim().replace(/[^\d]/g, ""), 10);
                const imgUrls = Array.from(
                    b.querySelectorAll('.pictureSlider div a')
                ).map(a => document.location.origin + a.attributes.getNamedItem('href').textContent);

                if (price === 0) {
                    return null;
                }

                const rows = b.querySelectorAll('tr.row_gray, tr.row_white');
                
                let characteristics = new Map<string, string>();

                rows.forEach(row => {
                    const nameElement = row.querySelector('.cell_name');
                    const valueElement = row.querySelector('.cell_value');

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
                    warranty: characteristics.get('Гарантійний термін'),
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