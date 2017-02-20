import {Component, Input} from '@angular/core';
import template from './ProductTile.html';
import styles from './ProductTile.scss';

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

    // product (based on the Product service schema)
    @Input() product = null;

    constructor() {

    }
}
