import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './AdminFooter.html';
import styles from './AdminFooter.scss';

@Component({
    selector: 'admin-footer',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <admin-footer name="AdminFooter" (change)="onChange($event)"></admin-footer>
 */
export default class AdminFooter {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'AdminFooter';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
