import {Component} from '@angular/core';
import i18next from 'i18next';
import $ from 'jquery';
import template from './LanguageSelector.html';
import styles from './LanguageSelector.scss';

@Component({
    selector: 'language-selector',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <language-selector name="LanguageSelector" (change)="onChange($event)"></language-selector>
 */
export default class LanguageSelector {

    languageOptions:Array = [
        {
            localizationKey: 'English',
            locale: 'en'
        },
        {
            localizationKey: 'Pseudo',
            locale: 'qps'
        }
    ];

    constructor() {

    }

    onLanguageChanged(language) {
        // reset the main language in i18next
        i18next.changeLanguage(language);

        // tell the document to update the localization
        let doc = $('html');
        doc.localize();
    }
}
