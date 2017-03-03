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

    PAGE_SIZE:Number = 60;

    _orderService:OrderService;

    // binding property for the UI
    orders:Array<Object>;
    pagedOrders:Array;
    pageIndices:Array<Number>;
    selectedPage:Number;

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

        // build the page indices
        let pageCount = Math.ceil(this.orders.length / this.PAGE_SIZE);
        this.pageIndices = Array(pageCount).fill().map((x, i) => i);
        this.goToPage(this.pageIndices[0]);
    }

    goToPage(index) {
        if (index >= 0 && index < this.pageIndices.length) {
            this.selectedPage = index;

            let start = this.selectedPage * this.PAGE_SIZE;
            let end = start + this.PAGE_SIZE;
            this.pagedOrders = this.orders.slice(start, end);
        }
    }

    goToPreviousPage() {
        this.goToPage(this.selectedPage - 1);
    }

    goToNextPage() {
        this.goToPage(this.selectedPage + 1);
    }
}
