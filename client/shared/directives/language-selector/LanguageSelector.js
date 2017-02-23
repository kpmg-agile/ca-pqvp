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

    selectedLanguage:any = undefined;

    constructor() {

    }

    ngOnInit() {
        i18next.on('languageChanged', () => {
            this.determineCurrentLanguage();
            this.onLanguageChanged(i18next.language);
        });
    }

    determineCurrentLanguage() {
        let currentLocale = i18next.language;
        let optionLocale = this.languageOptions.filter(language => language.locale === currentLocale);

        if (optionLocale && optionLocale.length) {
            // initialize the language selection to whichever locale i18next is using
            this.selectedLanguage = optionLocale[0].locale;
        } else {
            // if there is no current locale set in i18next, set it to the first in our predetermined locale set
            this.selectedLanguage = this.languageOptions[0].locale;
            this.onLanguageChanged(this.selectedLanguage);
        }
    }

    onLanguageChanged(language) {
        if (language !== i18next.language) {
            i18next.changeLanguage(language);
        }

        localStorage.setItem('i18nextLng', language);

        // tell the document to update the localization
        let doc = $('html');
        doc.localize();
    }
}
