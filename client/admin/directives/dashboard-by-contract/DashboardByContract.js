import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './DashboardByContract.html';
import styles from './DashboardByContract.scss';

@Component({
    selector: 'dashboard-by-contract',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <dashboard-by-contract name="DashboardByContract" (change)="onChange($event)"></dashboard-by-contract>
 */
export default class DashboardByContract {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'DashboardByContract';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
