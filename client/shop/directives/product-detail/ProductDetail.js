import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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

    _router:Router;
    _route:ActivatedRoute;
    _cartService:CartService;
    _api:Api;

    productId:string;
    product;

    constructor(router:Router, route:ActivatedRoute, cartService:CartService) {
        this._router = router;
        this._route = route;
        this._cartService = cartService;
        this._api = new Api();
    }

    ngOnInit() {
        this._route.params.subscribe(params => {
            if (params && params.productId) {
                this.loadProduct(params.productId);
            }
        });
    }

    async loadProduct(productId) {
        this.productId = productId;
        this.product = await this._api.products.productId({productId}).get().json();
    }

    async addToCart() {
        await this._cartService.addItem(this.product, 1);
        this._router.navigate(['/shop/cart']);
    }
}
