import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './Catalog.html';
import styles from './Catalog.scss';

@Component({
    selector: 'catalog',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <catalog name="Catalog" (change)="onChange($event)"></catalog>
 */
export default class Catalog {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Catalog';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
