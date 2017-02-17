import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './MainFooter.html';
import styles from './MainFooter.scss';

@Component({
    selector: 'main-footer',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <main-footer name="MainFooter" (change)="onChange($event)"></main-footer>
 */
export default class MainFooter {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'MainFooter';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
