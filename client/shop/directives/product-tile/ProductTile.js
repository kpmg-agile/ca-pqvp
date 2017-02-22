import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import template from './ProductTile.html';
import styles from './ProductTile.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'product-tile',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-tile name="ProductTile" (change)="onChange($event)"></product-tile>
 */
export default class ProductTile {

    _api:Api;
    _sanitizer:DomSanitizer;
    _product;

    // product (based on the Product service schema)
    @Input()
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.fetchImage();
    }

    // view layout flag
    @Input() isSmall:Boolean;

    async fetchImage() {
        let image = await this._api.images.imageId({imageId: this.product.images[0]}).get().json();
        this.primaryImage =  this._sanitizer.bypassSecurityTrustUrl(image.imageData);
    }

    constructor(sanitizer:DomSanitizer) {
        this._sanitizer = sanitizer;
        this._api = new Api();
    }
}
