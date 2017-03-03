// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Injectable} from '@angular/core';
import ObservableProperty from '../../../shared/properties/ObservableProperty';
import Api from '../../../../raml/api.v1.raml';

/**
 * @example
 * let injector = Injector.resolveAndCreate([OrderService]);
 * let orderService = new injector.get(OrderService);
 * @example
 * class Component {
 * 		constructor(orderService:OrderService, orderService2:OrderService) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log(orderService === orderService2);
 *		}
 * }
 */
@Injectable()
export default class OrderService {

    DISPLAY_LIMIT:Number = 10;

    @ObservableProperty() orders:Array = []; // seems to be important this not be left uninitialized
    @ObservableProperty() groupedOrders:Array = []; // seems to be important this not be left uninitialized

    _api:Api;
    _fetchStarted:Boolean = false;

    constructor() {
        this._api = new Api();
    }

    async fetchOrders() {
        if (!this._fetchStarted) {
            this._fetchStarted = true;

            let orders = await this._api.orders.get().json();
            orders.sort( (a, b) => b.dateCreated - a.dateCreated);
            let processingOrders = orders.filter( o => o.status === 'PROCESSING' );
            let completedOrders = orders.filter( o => o.status === 'COMPLETE' );
            let closedOrders = orders.filter( o => o.status === 'CLOSED' );

            // set the observable properties
            this.groupedOrders = [
                {key: 'inProgress', orders: processingOrders.slice(0, this.DISPLAY_LIMIT) },
                {key: 'completed', orders: completedOrders.slice(0, this.DISPLAY_LIMIT) },
                {key: 'closedOrCancelled', orders: closedOrders.slice(0, this.DISPLAY_LIMIT) }
            ];
            this.orders = orders;

            // clear the state flag
            this._fetchStarted = false;
        }
    }
}
