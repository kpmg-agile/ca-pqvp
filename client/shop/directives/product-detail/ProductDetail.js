import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import template from './ProductDetail.html';
import styles from './ProductDetail.scss';
import Api from '../../../../raml/api.v1.raml';
import {CartService} from '../../../app/providers';

@Component({
    selector: 'product-detail',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-detail name="ProductDetail" (change)="onChange($event)"></product-detail>
 */
export default class ProductDetail {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'ProductDetail';

    _api:Api;
    _cartService:CartService;

    productId:string;
    product;

    constructor(route:ActivatedRoute, cartService:CartService) {
        this._route = route;
        this._api = new Api();
        this._cartService = cartService;
    }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.loadProduct(params.productId);
        });
    }

    async loadProduct(productId) {
        this.productId = productId;
        this.product = await this._api.products.productId({productId}).get().json();
    }

    addToCart() {
        this._cartService.addItem(this.product, 1);
    }
}
