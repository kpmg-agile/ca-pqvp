// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component} from '@angular/core';
import template from './Orders.html';
import styles from './Orders.scss';
import {OrderService} from '../../../app/providers';

@Component({
    selector: 'orders',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <orders name="Orders" (change)="onChange($event)"></orders>
 */
export default class Orders {

    _orderService:OrderService;

    // binding property for the UI
    orders:Array<Object>;

    constructor(orderService:OrderService) {
        this._orderService = orderService;
    }

    async ngOnInit() {

        // register a change event handler on the service and kick off a fetch in case it hasn't happened yet.
        this._orderService.ordersObservable.subscribe((values) => {
            this.configureOrders(values.currentValue);
        });

        // kick off a fetch in it hasn't started already
        await this._orderService.fetchOrders();

        // if an existing data set is already loaded, populate from it.
        if (this._orderService.orders && this._orderService.orders.length) {
            this.configureOrders(this._orderService.orders);
        }
    }

    configureOrders(orders) {
        this.orders = orders;
        this.orders.forEach( (order) => {
            order.quantity = 0;
            order.orderItems.forEach( (orderItem) => {
                order.quantity += orderItem.quantity;
            });
        });
    }
}
