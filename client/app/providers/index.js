import config from '../../../config/app.config';
import {
    LocationStrategy,
    HashLocationStrategy
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
