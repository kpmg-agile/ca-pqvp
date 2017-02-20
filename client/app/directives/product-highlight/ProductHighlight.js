import {Component, Input} from '@angular/core';
import template from './ProductHighlight.html';
import styles from './ProductHighlight.scss';

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

    // product (based on the Product service schema)
    @Input() product = null;

    constructor() {

    }
}
