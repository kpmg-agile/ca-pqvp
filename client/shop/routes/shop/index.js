import Shop from './Shop';
import ProductCart from '../../directives/product-cart/ProductCart';
import ProductList from '../../directives/product-list/ProductList';

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
        }
    ]
};

export default ROUTE;
