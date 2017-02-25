import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import template from './Orders.html';
import styles from './Orders.scss';
import Api from '../../../../raml/api.v1.raml';
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

    _api:Api;
    _sanitizer:DomSanitizer;
    _orderService:OrderService;

    groupedOrders:Array;
    currentGroup:Object;
    currentOrder:Object;

    constructor(sanitizer:DomSanitizer, orderService:OrderService) {
        this._sanitizer = sanitizer;
        this._orderService = orderService;
        this._api = new Api();
    }

    ngOnInit() {

        // register a change event handler on the service and kick off a fetch in case it hasn't happened yet.
        this._orderService.groupedOrdersObservable.subscribe((values) => { this.onGroupedOrdersChanged(values.currentValue); });
        this._orderService.fetchOrders();

        // if an existing data set is already loaded, populate from it.
        if (this._orderService.groupedOrders && this._orderService.groupedOrders.length) {
            this.onGroupedOrdersChanged(this._orderService.groupedOrders);
        }
    }

    onGroupedOrdersChanged(groupedOrders) {
        // pull the set of orders out of the service
        this.groupedOrders = groupedOrders;

        // select an order for display if available
        if (this.groupedOrders.length) {
            let firstPopulatedGroup = this.groupedOrders.find(group => group.orders.length > 0);
            if (firstPopulatedGroup) {
                this.currentGroup = firstPopulatedGroup.key;
                this.selectOrder(firstPopulatedGroup.orders[0]);
            } else {
                this.currentGroup = this._orderService.groupedOrders[0].key;
            }
        } else {
            this.currentGroup = undefined;
            this.currentOrder = undefined;
        }
    }

    async selectOrder(order) {
        this.currentOrder = order;
        order.orderItems.forEach( item => { this.loadItemDetails(item); } );
    }

    async loadItemDetails(item) {
        // the product state is unlikely to change, so guard here against reloading it repeatedly
        if (!item.name) {
            let itemDetails = await this._api.products.productId({productId: item.orderItemId}).get().json();
            item.name = itemDetails.name;
            item.unitPrice = itemDetails.unitPrice;
            item.contractNum = itemDetails.contractNum;
            item.contractor = itemDetails.contractor;

            let image = await this._api.images.imageId({imageId: itemDetails.defaultImageId}).get().json();
            item.image =  this._sanitizer.bypassSecurityTrustUrl(image.imageData);
        }
    }

    cancelOrder(/*order*/) {
        alert('Not yet implemented'); // eslint-disable-line
    }

    trackOrderItem(/*item*/) {
        alert('Not yet implemented'); // eslint-disable-line
    }
}
