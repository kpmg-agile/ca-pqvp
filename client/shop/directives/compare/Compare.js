import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
    _api:Api;
    productDetails:Array = [];

    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Compare';

    constructor(router:Router, route:ActivatedRoute) {
        this._router = router;
        this._route = route;
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
            this.productDetails.push( await this._api.products.productId({productId: p}).get().json() );
        });
    }
}
