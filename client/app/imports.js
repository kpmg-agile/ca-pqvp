// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {SHARED_IMPORTS} from '../shared/imports';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './routes';

export const APP_IMPORTS = [
    ...SHARED_IMPORTS,
    RouterModule.forRoot(APP_ROUTES)
];

import {ShopModule} from '../shop';
APP_IMPORTS.push(ShopModule);

import {SharedModule} from '../shared';
APP_IMPORTS.push(SharedModule);

import {AdminModule} from '../admin';
APP_IMPORTS.push(AdminModule);