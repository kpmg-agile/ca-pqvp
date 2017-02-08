import {Component} from '@angular/core';
import template from './App.html';
import styles from './App.scss';
import info from '../../../../package.json';
import Api from '../../../../raml/api.v1.raml';

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

    /**
     * A list of all users in the system
     * @type {Array}
     */
    users:Array<Object> = [];

    /**
     * The current user logged into the application
     * @type {Object}
     */
    currentUser:Object = null;

    constructor() {

    }

    async ngOnInit() {
        let api = new Api();
        this.currentUser = await api.users.current.get().json();
        this.users = await api.users.get().json();
    }
}
