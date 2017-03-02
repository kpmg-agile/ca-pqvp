// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

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
