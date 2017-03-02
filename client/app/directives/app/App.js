// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component} from '@angular/core';
import template from './App.html';
import styles from './App.scss';
import info from '../../../../package.json';

@Component({
    selector: 'body',
    template: template,
    styles: [styles],
    directives: []
})

/**
 * @example
 * <app></app>
 */
export default class App {

    /**
     * The name of the application
     * @type {string}
     */
    name:string = info.name;
}
