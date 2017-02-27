import config from '../../../config/app.config';
import {
    LocationStrategy,
    HashLocationStrategy,
    APP_BASE_HREF
} from '@angular/common';

/**
 * Default list of providers that can be used for bootstrap. The contents
 * of this file are automatically modified during scaffolding of services
 * for convenience to auto register them.
 */
export const APP_PROVIDERS = [];

if (!config.html5HistoryMode) {
    APP_PROVIDERS.push({provide: LocationStrategy, useClass: HashLocationStrategy});
}
APP_PROVIDERS.push({provide: APP_BASE_HREF, useValue: '/'});

import CartService from './cart-service';
export {CartService as CartService};
APP_PROVIDERS.push(CartService);
import OrderService from './order-service';
export {OrderService as OrderService};
APP_PROVIDERS.push(OrderService);
