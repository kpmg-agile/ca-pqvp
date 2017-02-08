//This file should include any vendor imports you want to be bundled separately from the app

import {Request} from 'popsicle';

/**
 * Adding a helper method to popsicle Request
 * objects so we can resolve the responses
 * directly to a JSON parsed object from the body.
 * @returns {Promise<any>|*} A promise
 */
Request.prototype.json = function () {
    return this.then(res => JSON.parse(res.body));
};

/*
 * Setup the i18next defaults
 * @see http://i18next.com/docs/options/
 */
import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import Cache from 'i18next-localstorage-cache';
import LanguageDetector from 'i18next-browser-languagedetector';
import config from '../config/i18next.config';

i18next
    .use(Backend)
    .use(Cache)
    .use(LanguageDetector)
    .init(config);

/*
 * Add in the default language so its baked into the app
 * and doesn't require a separate load.
 */
i18next.addResourceBundle(
    config.fallbackLng,
    config.defaultNS,
    require(`./locales/${config.fallbackLng}/${config.defaultNS}.json`)
);

/*
 * Setup all the Angular2 dependencies so they are
 * bundled here instead of main app.
 */

import 'babel-polyfill';
import 'zone.js/dist/zone';
//import 'zone.js/dist/long-stack-trace-zone';
import 'reflect-metadata/Reflect.js';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';

import '@angular/core';
import '@angular/common';
import '@angular/compiler';
import '@angular/http';
import '@angular/router';
import '@angular/platform-browser-dynamic';
