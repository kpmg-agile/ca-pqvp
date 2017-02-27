import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './ContractDetails.html';
import styles from './ContractDetails.scss';

@Component({
    selector: 'contract-details',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <contract-details name="ContractDetails" (change)="onChange($event)"></contract-details>
 */
export default class ContractDetails {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'ContractDetails';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
