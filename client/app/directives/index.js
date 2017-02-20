export const APP_DIRECTIVES = [];

import App from './app';
export {App as App};
APP_DIRECTIVES.push(App);

import MainHeader from './main-header';
export {MainHeader as MainHeader};
APP_DIRECTIVES.push(MainHeader);

import MainFooter from './main-footer';
export {MainFooter as MainFooter};
APP_DIRECTIVES.push(MainFooter);

import ProductList from './product-list';
export {ProductList as ProductList};
APP_DIRECTIVES.push(ProductList);

import ProductCart from './product-cart';
export {ProductCart as ProductCart};
APP_DIRECTIVES.push(ProductCart);

import LanguageSelector from './language-selector';
export {LanguageSelector as LanguageSelector};
APP_DIRECTIVES.push(LanguageSelector);

import SmokeTest from './smoke-test';
export {SmokeTest as SmokeTest};
APP_DIRECTIVES.push(SmokeTest);

import ProductTile from './product-tile';
export {ProductTile as ProductTile};
APP_DIRECTIVES.push(ProductTile);
import ProductHighlight from './product-highlight';
export {ProductHighlight as ProductHighlight};
APP_DIRECTIVES.push(ProductHighlight);