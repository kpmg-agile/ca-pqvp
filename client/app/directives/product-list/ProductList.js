import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './ProductList.html';
import styles from './ProductList.scss';

@Component({
    selector: 'product-list',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-list name="ProductList" (change)="onChange($event)"></product-list>
 */
export default class ProductList {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'ProductList';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
