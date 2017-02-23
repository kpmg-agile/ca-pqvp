import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import template from './Orders.html';
import styles from './Orders.scss';
import Api from '../../../../raml/api.v1.raml';

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
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Orders';

    _api:Api;
    _sanitizer:DomSanitizer;
    groupedOrders:Array;
    currentOrder:Object;

    constructor(sanitizer:DomSanitizer) {
        this._sanitizer = sanitizer;
        this._api = new Api();
    }

    async ngOnInit() {
        let orders = await this._api.orders.get().json();
        this.groupedOrders = [
            {key: 'inProgress', orders: orders.filter( o => o.status === 'PROCESSING' )},
            {key: 'completed', orders: orders.filter( o => o.status === 'COMPLETE' )},
            {key: 'closedOrCancelled', orders: orders.filter( o => o.status === 'CLOSED' )}
        ];

        this.currentGroup = 'inProgress';
        if (orders.length) {
            this.selectOrder(orders[0]);
        }
    }

    async selectOrder(order) {
        this.currentOrder = order;
        order.orderItems.forEach( item => { this.loadItemDetails(item); } );
    }

    async loadItemDetails(item) {
        let itemDetails = await this._api.products.productId({productId: item.orderItemId}).get().json();
        item.name = itemDetails.name;
        item.unitPrice = itemDetails.unitPrice;

        let image = await this._api.images.imageId({imageId: itemDetails.images[0]}).get().json();
        item.image =  this._sanitizer.bypassSecurityTrustUrl(image.imageData);
    }

    cancelOrder(/*order*/) {
        alert('Not yet implemented'); // eslint-disable-line
    }
}
