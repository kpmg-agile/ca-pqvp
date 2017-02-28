import {Component} from '@angular/core';
import template from './ContentFooter.html';
import styles from './ContentFooter.scss';

@Component({
    selector: 'content-footer',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <content-footer name="ContentFooter" (change)="onChange($event)"></content-footer>
 */
export default class ContentFooter {

    constructor() {

    }
}
