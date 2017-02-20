export const APP_ROUTES = [];
export const APP_COMPONENTS = [];

// default route
APP_ROUTES.push({ path: '', redirectTo: '/login', pathMatch: 'full' });

import Login from './login';
export {Login as Login};
APP_ROUTES.push(Login);
APP_COMPONENTS.push(Login.component);

import Shop from './shop';
export {Shop as Shop};
APP_ROUTES.push(Shop);
APP_COMPONENTS.push(Shop.component);

import Admin from './admin';
export {Admin as Admin};
APP_ROUTES.push(Admin);
APP_COMPONENTS.push(Admin.component);

import Console from './console';
export {Console as Console};
APP_ROUTES.push(Console);
APP_COMPONENTS.push(Console.component);

import ProductDetail from './product-detail';
export {ProductDetail as ProductDetail};
APP_ROUTES.push(ProductDetail);
APP_COMPONENTS.push(ProductDetail.component);