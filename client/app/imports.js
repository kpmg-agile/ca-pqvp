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
