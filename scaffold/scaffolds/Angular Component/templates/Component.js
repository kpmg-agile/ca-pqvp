import {Component, Input, Output, EventEmitter} from '@angular/core';
import template from './{{answers.name}}.html';
import styles from './{{answers.name}}{{config.extensions.styles}}';

@Component({
    selector: '{{hyphenCase answers.name}}',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <{{hyphenCase answers.name}} name="{{answers.name}}" (change)="onChange($event)"></{{hyphenCase answers.name}}>
 */
export default class {{answers.name}} {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = '{{answers.name}}';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    constructor() {

    }
}
