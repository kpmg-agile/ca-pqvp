import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './ProductCart.html';
import styles from './ProductCart.scss';

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

    constructor() {

    }
}
