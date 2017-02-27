import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './CatalogItem.html';
import styles from './CatalogItem.scss';

@Component({
    selector: 'catalog-item',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <catalog-item name="CatalogItem" (change)="onChange($event)"></catalog-item>
 */
export default class CatalogItem {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'CatalogItem';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
