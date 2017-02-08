import AppModule from './app';
import config from '../config/app.config';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

if (config.environment === 'production') {
    enableProdMode();
}

if (typeof(jasmine) === 'undefined') {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
