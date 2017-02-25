import Admin from './Admin';
import Dashboard from '../../directives/dashboard';

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
        }
    ]
};

export default ROUTE;
