import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './OrderItem.html';
import styles from './OrderItem.scss';

@Component({
    selector: 'order-item',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <order-item name="OrderItem" (change)="onChange($event)"></order-item>
 */
export default class OrderItem {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'OrderItem';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
