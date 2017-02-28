export const SHOP_DIRECTIVES = [];

import ProductCart from './product-cart';
export {ProductCart as ProductCart};
SHOP_DIRECTIVES.push(ProductCart);

import ProductHighlight from './product-highlight';
export {ProductHighlight as ProductHighlight};
SHOP_DIRECTIVES.push(ProductHighlight);

import ProductDetail from './product-detail';
export {ProductDetail as ProductDetail};
SHOP_DIRECTIVES.push(ProductDetail);

import Orders from './orders';
export {Orders as Orders};
SHOP_DIRECTIVES.push(Orders);

import Budget from './budget';
export {Budget as Budget};
SHOP_DIRECTIVES.push(Budget);

import Compare from './compare';
export {Compare as Compare};
SHOP_DIRECTIVES.push(Compare);
