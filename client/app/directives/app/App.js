import {Component} from '@angular/core';
import template from './App.html';
import styles from './App.scss';
import info from '../../../../package.json';
import $ from 'jquery';

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

    constructor() {
        const doc = $('html');
        doc.localize();
    }
    async ngOnChanges() {
        const doc = $('html');
        doc.localize();
    }
    async ngAfterContentInit() {
        const doc = $('html');
        doc.localize();
    }
    async ngAfterViewInit() {
        const doc = $('html');
        doc.localize();
    }
}
