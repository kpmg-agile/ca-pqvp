import Shop from './Shop';
import ProductCart from '../../directives/product-cart';
import ProductList from '../../directives/product-list';
import ProductDetail from '../../directives/product-detail';

/**
 * @see https://angular.io/docs/ts/latest/api/router/index/Route-interface.html
 * @type {*}
 */
const ROUTE = {
    path: 'shop',
    component: Shop,
    children: [
        {
            path: 'products',
            component: ProductList
        },
        {
            path: 'cart',
            component: ProductCart
        },
        {
            path: 'product/:productId',
            component: ProductDetail
        }
    ]
};

export default ROUTE;
