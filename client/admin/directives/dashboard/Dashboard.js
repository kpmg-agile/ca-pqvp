import {Component, Input} from '@angular/core';
import template from './Dashboard.html';
import styles from './Dashboard.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'dashboard',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <dashboard name="Dashboard" (change)="onChange($event)"></dashboard>
 */
export default class Dashboard {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Dashboard';

    _api:Api;

    constructor() {
        this._api = new Api();
    }

    users:Array = [];

    async ngOnInit() {
        this.contracts = await this._api.contracts.get().json();
        console.log('Dashboard.ngOnInit() contracts:', this.contracts);
    }
}
