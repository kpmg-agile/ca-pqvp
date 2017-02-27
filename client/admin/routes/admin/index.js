import Admin from './Admin';
import Dashboard from '../../directives/dashboard';
import DashboardByContract from '../../directives/dashboard-by-contract';
import Catalog from '../../directives/catalog';
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
            component: Catalog
        },
        {
            path: 'catalog-item',
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
