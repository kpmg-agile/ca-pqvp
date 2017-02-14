export const APP_ROUTES = [];

// default route
APP_ROUTES.push({ path: '', redirectTo: '/login', pathMatch: 'full' });

import Login from './login';
export {Login as Login};
APP_ROUTES.push(Login);

import Shop from './shop';
export {Shop as Shop};
APP_ROUTES.push(Shop);

import Admin from './admin';
export {Admin as Admin};
APP_ROUTES.push(Admin);
