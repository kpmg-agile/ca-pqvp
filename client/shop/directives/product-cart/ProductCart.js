import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import template from './ProductCart.html';
import styles from './ProductCart.scss';
import {CartService} from '../../../app/providers';
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
    _sanitizer:DomSanitizer;
    _router:Router;
    totalCost:number = 0;
    orderItems:Array = [];

    constructor(cartService:CartService, sanitizer:DomSanitizer, router:Router) {
        this._cartService = cartService;
        this._sanitizer = sanitizer;
        this._router = router;
        this._api = new Api();
    }

    async ngOnInit() {
        await this._cartService.fetchCart();
        this.totalCost = this._cartService.cart.totalCost;
        this.orderItems = this._cartService.cart.orderItems;

        this.orderItems.forEach( item => { this.loadItemDetails(item); } );
    }

    async loadItemDetails(item) {
        let itemDetails = await this._api.products.productId({productId: item.orderItemId}).get().json();
        item.name = itemDetails.name;
        item.unitPrice = itemDetails.unitPrice;

        let image = await this._api.images.imageId({imageId: itemDetails.defaultImageId}).get().json();
        item.image =  this._sanitizer.bypassSecurityTrustUrl(image.imageData);
    }

    removeItem(/*item*/) {
        alert('Not yet implemented'); //eslint-disable-line
    }

    async placeOrder() {
        this._api.orders.current.submitOrder.post().json();
        this._router.navigate(['/shop/orders']);
    }
}
