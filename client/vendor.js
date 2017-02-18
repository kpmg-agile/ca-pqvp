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
 * Add in the pseudoloc language so its baked into the app
 * and doesn't require a separate load.
 * TODO: exclude this from release builds
 */
i18next.addResourceBundle(
    'qps',
    config.defaultNS,
    require(`!json!pseudoloc!./locales/${config.fallbackLng}/${config.defaultNS}.json`)
);

/*
 * Use the jquery plugin to initialize i18next and add attribute
 * selector support.
 *
 * @see https://github.com/i18next/jquery-i18next
 */
import $ from 'jquery';
import jqueryI18next from 'jquery-i18next';

jqueryI18next.init(i18next, $, {
    tName: 't', // --> appends $.t = i18next.t
    i18nName: 'i18n', // --> appends $.i18n = i18next
    handleName: 'localize', // --> appends $(selector).localize(opts);
    selectorAttr: 'data-i18n', // selector for translating elements
    targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
    optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
    useOptionsAttr: false, // see optionsAttr
    parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
});

const doc = $('html');
doc.localize(); // --> localize what we already have on page with current resources
i18next.on('loaded', () => doc.localize()); // --> localize page again when new resource is loaded

// configuration of the DOM mutation observer so we know when to re-apply localization
// TODO: figure out if we can make this more efficient by reducing the list of changes we ask to observe
const oberserverConfig = { attributes: true, childList: true, subtree: true, characterData: true };

// create an observer instance
let observer = new MutationObserver(function(mutations) {

    // turn off the DOM mutation observer because we are about to make our own changes by applying localization
    observer.disconnect();

    // re-apply localization where the DOM has changed
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach( (node) => {
            // TODO: doesn't seem to work if we don't traverse up to the parent.  is there a more efficient way?
            $(node).parent().localize();
        });
    });

    // after DOM changes have been made by localization, turn the DOM observer back on
    setImmediate( () => {
        observer.observe(document, oberserverConfig);
    });
});

// begin observing the DOM for any changes that might require re-applying localization
observer.observe(document, oberserverConfig);

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

/*
 * Include the 18f component library.
 * @see https://standards.usa.gov/getting-started/developers/
 */
import 'uswds';
import 'style!uswds/src/stylesheets/_all.scss';
import 'uswds/src/fonts/merriweather-bold-webfont.woff2';
import 'uswds/src/fonts/merriweather-italic-webfont.woff2';
import 'uswds/src/fonts/merriweather-light-webfont.woff2';
import 'uswds/src/fonts/merriweather-regular-webfont.woff2';
import 'uswds/src/fonts/sourcesanspro-bold-webfont.woff2';
import 'uswds/src/fonts/sourcesanspro-italic-webfont.woff2';
import 'uswds/src/fonts/sourcesanspro-light-webfont.woff2';
import 'uswds/src/fonts/sourcesanspro-regular-webfont.woff2';
import 'uswds/src/img/arrow-down.svg';
// import 'uswds/dist/img/search.svg';
// import 'uswds/dist/img/plus-alt.svg';
