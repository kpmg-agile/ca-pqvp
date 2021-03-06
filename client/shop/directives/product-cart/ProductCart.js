// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import template from './ProductCart.html';
import styles from './ProductCart.scss';
import {CartService, OrderService} from '../../../app/providers';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'product-cart',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-cart name="ProductCart" (change)="onChange($event)"></product-cart>
 */
export default class ProductCart {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'ProductCart';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    _api:Api;
    _cartService:CartService;
    _orderService:OrderService;
    _sanitizer:DomSanitizer;
    _router:Router;
    totalCost:number = 0;
    orderItems:Array = [];

    constructor(cartService:CartService, orderService:OrderService, sanitizer:DomSanitizer, router:Router) {
        this._cartService = cartService;
        this._orderService = orderService;
        this._sanitizer = sanitizer;
        this._router = router;
        this._api = new Api();
    }

    async ngOnInit() {
        // TODO: deal with the duplicate cart calls if this page is loaded directly.
        //
        await this._cartService.fetchCart();
        this.totalCost = this._cartService.cart.totalCost;
        this.orderItems = this._cartService.cart.orderItems;

        this.orderItems.forEach( item => { this.loadItemDetails(item); } );
    }

    async loadItemDetails(item) {
        let itemDetails = await this._api.products.productId({productId: item.productId}).get().json();
        item.name = itemDetails.name;
        item.unitPrice = itemDetails.unitPrice;
        item.category = itemDetails.category;
        item.contractNumber = itemDetails.contractNumber;
        item.contractor = itemDetails.contractor;

        let imageId = itemDetails.defaultImageId ? itemDetails.defaultImageId : 0;
        let image = await this._api.images.imageId({imageId: imageId}).get().json();
        item.image =  image.imageURL;
    }

    removeItem(/*item*/) {
        alert('Not yet implemented'); //eslint-disable-line
    }

    updateQuantityForItem(/*item*/) {
        alert('Not yet implemented'); //eslint-disable-line
    }

    async placeOrder() {
        await this._api.orders.current.submitOrder.post().json();
        await this._cartService.fetchCart();
        await this._orderService.fetchOrders();
        this._router.navigate(['/shop/orders']);
    }
}
