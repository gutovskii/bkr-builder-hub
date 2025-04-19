import TouchImg from '../images/marketplacesLogos/touch.webp';
import ZhukImg from '../images/marketplacesLogos/zhuk.png';
import ItboxImg from '../images/marketplacesLogos/itbox.jpg';

const marketplaceNameToLogoConfig = {
    Touch: TouchImg,
    Zhuk: ZhukImg,
    Itbox: ItboxImg,
}

export const getMarketplaceLogo = (shopName: keyof typeof marketplaceNameToLogoConfig) => {
    return marketplaceNameToLogoConfig[shopName];
}