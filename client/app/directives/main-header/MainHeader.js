import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './MainHeader.html';
import styles from './MainHeader.scss';

@Component({
    selector: 'main-header',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <main-header name="MainHeader" (change)="onChange($event)"></main-header>
 */
export default class MainHeader {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'MainHeader';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
