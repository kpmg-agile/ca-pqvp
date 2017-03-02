// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

export const APP_ROUTES = [];
export const APP_COMPONENTS = [];

// default route
APP_ROUTES.push({ path: '', redirectTo: '/login', pathMatch: 'full' });

import Login from './login';
export {Login as Login};
APP_ROUTES.push(Login);
APP_COMPONENTS.push(Login.component);
