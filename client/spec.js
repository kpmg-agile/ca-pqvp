import './vendor';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/jasmine-patch';

import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {TestBed, MockApplicationRef} from '@angular/core/testing';
import {ApplicationRef} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {APP_PROVIDERS} from './app/providers';
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting([
    APP_PROVIDERS,
    MockBackend,
    BaseRequestOptions,
    {provide: Http, useFactory: (backend, options) => { return new Http(backend, options); }, deps: [MockBackend, BaseRequestOptions]},
    {provide: ApplicationRef, useClass: MockApplicationRef}
]));

//require all source files for proper coverage inspection
const src = require.context('./', true, /[^spec|e2e]\.(js|jsx)$/);
src.keys().forEach(src);

//require all spec files for tests
const test = require.context('./', true, /spec\.(js|jsx)$/);
test.keys().forEach(test);