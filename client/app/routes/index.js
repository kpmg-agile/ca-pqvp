export const APP_ROUTES = [];
export const APP_COMPONENTS = [];

// default route
APP_ROUTES.push({ path: '', redirectTo: '/login', pathMatch: 'full' });

import Login from './login';
export {Login as Login};
APP_ROUTES.push(Login);
APP_COMPONENTS.push(Login.component);
