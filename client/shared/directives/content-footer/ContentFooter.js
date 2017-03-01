import {Component} from '@angular/core';
import template from './ContentFooter.html';
import styles from './ContentFooter.scss';
import $ from 'jquery';

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

    returnToTop() {
        // using some script to target the top of the page because angular wants to navigate with an href="#top"
        // scroll the window
        window.scrollTo(0, 0);

        // shift the focus onto the header we know should be there
        let focusTarget = $('#languageOptions');
        focusTarget.focus();
    }
}
