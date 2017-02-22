export const SHOP_ROUTES = [];
export const SHOP_COMPONENTS = [];

import ProductDetail from './product-detail';
export {ProductDetail as ProductDetail};

SHOP_ROUTES.push(ProductDetail);
SHOP_COMPONENTS.push(ProductDetail.component);

import Shop from './shop';
export {Shop as Shop};

SHOP_ROUTES.push(Shop);
SHOP_COMPONENTS.push(Shop.component);