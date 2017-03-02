// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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

    constructor(route:ActivatedRoute, sanitizer:DomSanitizer, orderService:OrderService) {
        this._route = route;
        this._sanitizer = sanitizer;
        this._orderService = orderService;
        this._api = new Api();
    }

    async ngOnInit() {

        // register a change event handler on the service and kick off a fetch in case it hasn't happened yet.
        this._orderService.groupedOrdersObservable.subscribe((values) => { this.onGroupedOrdersChanged(values.currentValue); });
        await this._orderService.fetchOrders();

        // if an existing data set is already loaded, populate from it.
        if (this._orderService.groupedOrders && this._orderService.groupedOrders.length) {
            this.onGroupedOrdersChanged(this._orderService.groupedOrders);
            this.onCurrentGroupChanged('inProgress');
        }

        // setup a watch on the route to handle changes for the current key
        this._route.params.subscribe(params => {
            console.log(params);
            if (params.key) {
                // the user selected a specific key
                this.onCurrentGroupChanged(params.key);
            } else if (params.orderId) {
                // the user selected a specific orderId
                this.onCurrentOrderChanged(params.orderId);
            }
        });
    }

    onCurrentGroupChanged(key) {

        this.currentGroup = key;

        if (this.groupedOrders) {
            let groupForKey = this.groupedOrders.find(group => group.key === this.currentGroup);
            if (groupForKey && groupForKey.orders && groupForKey.orders.length) {
                this.selectOrder(groupForKey.orders[0]);
            } else {
                this.currentOrder = undefined;
            }
        } else {
            this.currentOrder = undefined;
        }
    }

    onCurrentOrderChanged(orderId) {
        if (this.groupedOrders) {
            // (+) converts string 'id' to a number
            let orderIdNumber = +orderId;
            let i = 0, limit = this.groupedOrders.length, groupForOrder, order;
            for (i = 0; i <  limit; i++) {
                if (this.groupedOrders[i].orders) {
                    order = this.groupedOrders[i].orders.find(order => order.orderId === orderIdNumber);
                    if (order) {
                        groupForOrder = this.groupedOrders[i];
                        break;
                    }
                }
            }

            if (order) {
                this.currentGroup = groupForOrder.key;
                this.selectOrder(order);
            }
        } else {
            this.currentOrder = undefined;
        }
    }

    onGroupedOrdersChanged(groupedOrders) {
        // any the new group to our local reference
        this.groupedOrders = groupedOrders;

        // now look for a group and order to display from the new data.
        //
        // first try to set the value from the current group if it is already set
        if (this.currentGroup) {
            this.onCurrentGroupChanged();
        }
        // next try to set them from a route based order id if one exists
        else if (this._route.snapshot.params.orderId) {
            this.onCurrentOrderChanged(this._route.snapshot.params.orderId);
        }
        // lastly, just try to find the fisrt order any group has
        else if (this.groupedOrders.length) {
            let firstPopulatedGroup = this.groupedOrders.find(group => group.orders.length > 0);
            if (firstPopulatedGroup) {
                this.currentGroup = firstPopulatedGroup.key;
                this.selectOrder(firstPopulatedGroup.orders[0]);
            } else {
                this.currentGroup = this._orderService.groupedOrders[0].key;
            }
        // finally give up, leave them undefined
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
            let itemDetails = await this._api.products.productId({productId: item.productId}).get().json();
            item.name = itemDetails.name;
            item.unitPrice = itemDetails.unitPrice;
            item.contractNum = itemDetails.contractNum;
            item.contractor = itemDetails.contractor;

            let image = await this._api.images.imageId({imageId: itemDetails.defaultImageId}).get().json();
            item.image =  image.imageURL;
        }
    }

    cancelOrder(/*order*/) {
        alert('Not yet implemented'); // eslint-disable-line
    }

    trackOrderItem(/*item*/) {
        alert('Not yet implemented'); // eslint-disable-line
    }
}
