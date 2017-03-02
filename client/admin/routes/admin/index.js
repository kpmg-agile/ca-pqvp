// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import Admin from './Admin';
import Dashboard from '../../directives/dashboard';
import DashboardByContract from '../../directives/dashboard-by-contract';
import ProductList from '../../../shared/directives/product-list';
import CatalogItem from '../../directives/catalog-item';
import Orders from '../../directives/orders';
import OrderItem from '../../directives/order-item';
import Contracts from '../../directives/contracts';
import ContractDetails from '../../directives/contract-details';

/**
 * @see https://angular.io/docs/ts/latest/api/router/index/Route-interface.html
 * @type {*}
 */
const ROUTE = {
    path: 'admin',
    component: Admin,
    children: [
        {
            path: 'dashboard',
            component: Dashboard
        },
        {
            path: 'dashboard-by-contract',
            component: DashboardByContract
        },
        {
            path: 'catalog',
            component: ProductList
        },
        {
            path: 'catalog-item/:productId',
            component: CatalogItem
        },
        {
            path: 'orders',
            component: Orders
        },
        {
            path: 'order-item',
            component: OrderItem
        },
        {
            path: 'contracts',
            component: Contracts
        },
        {
            path: 'contract-details',
            component: ContractDetails
        }
    ]
};

export default ROUTE;
