import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './Contracts.html';
import styles from './Contracts.scss';

@Component({
    selector: 'contracts',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <contracts name="Contracts" (change)="onChange($event)"></contracts>
 */
export default class Contracts {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Contracts';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
