import {Component, Input, Output, EventEmitter} from '@angular/core';
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

    @Output()
    compareToggled = new EventEmitter();

    _api:Api;
    _sanitizer:DomSanitizer;
    _product;

    isCompareChecked = false;

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

    // view layout flag
    @Input() isCompareAvailable:Boolean;

    async fetchImage() {
        let image = await this._api.images.imageId({imageId: this.product.defaultImageId}).get().json();
        this.primaryImage =  this._sanitizer.bypassSecurityTrustUrl(image.imageData);
    }

    constructor(sanitizer:DomSanitizer) {
        this._sanitizer = sanitizer;
        this._api = new Api();
    }

    onCompareClick($event) {
        // stop the event from triggering a route change
        $event.stopPropagation();
    }

    onCompareChange() {
        // notify external listeners that the compare toggle was changed
        this.compareToggled.emit({product: this._product, compare: this.isCompareChecked});
    }
}
