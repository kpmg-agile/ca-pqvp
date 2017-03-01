import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import template from './ProductHighlight.html';
import styles from './ProductHighlight.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'product-highlight',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-highlight name="ProductHighlight" (change)="onChange($event)"></product-highlight>
 */
export default class ProductHighlight {

    _api:Api;
    _sanitizer:DomSanitizer;
    _product;;

    // product (based on the Product service schema)
    @Input()
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.fetchImage();
    }

    async fetchImage() {
        let image = await this._api.images.imageId({imageId: this.product.defaultImageId}).get().json();
        this.primaryImage = image.imageURL;
    }

    constructor(sanitizer:DomSanitizer) {
        this._sanitizer = sanitizer;
        this._api = new Api();
    }

}
