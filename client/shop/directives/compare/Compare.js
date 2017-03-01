import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import Api from '../../../../raml/api.v1.raml';
import template from './Compare.html';
import styles from './Compare.scss';

@Component({
    selector: 'compare',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <compare name="Compare" (change)="onChange($event)"></compare>
 */
export default class Compare {
    _router:Router;
    _route:ActivatedRoute;
    _sanitizer:DomSanitizer;
    _api:Api;
    productDetails:Array = [];

    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Compare';

    constructor(router:Router, route:ActivatedRoute, sanitizer:DomSanitizer) {
        this._router = router;
        this._route = route;
        this._sanitizer = sanitizer;
        this._api = new Api();
    }

    ngOnInit() {
        this._route.params.subscribe(params => {
            if (params && params.products) {
                this.loadProducts(params.products.split('-'));
            }
        });
    }

    loadProducts(products:Array) {
        this.productDetails = [];
        products.forEach( async (p) => {
            let product = await this._api.products.productId({productId: p}).get().json();
            this.productDetails.push( product );

            let image = await this._api.images.imageId({imageId: product.defaultImageId}).get().json();
            product.primaryImage =  image.imageURL;
        });
    }
}
