// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

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

    contracts:Array = [];
    expenditures:Array = [];

    async ngOnInit() {
        this.contracts = await this._api.contracts.get().json();
        this.expenditures = await this._api.expenditures.get().json();
    }
}
