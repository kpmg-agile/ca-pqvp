// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component, Input} from '@angular/core';
import i18next from 'i18next';
import $ from 'jquery';
import template from './LanguageSelector.html';
import styles from './LanguageSelector.scss';
import config from '../../../../config/app.config';

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

    @Input() isLight:Boolean = false;

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
        this.determineCurrentLanguage();

        i18next.on('languageChanged', () => {
            this.determineCurrentLanguage();
            this.onLanguageChanged(i18next.language);
        });
    }

    determineCurrentLanguage() {
        let currentLocale = i18next.language || config.defaultLangCode;
        let optionLocale = this.languageOptions.filter(language => language.locale === currentLocale);

        if (optionLocale && optionLocale.length) {
            // initialize the language selection to whichever locale i18next is using
            this.selectedLanguage = optionLocale[0].locale;
        } else {
            // if there is no current locale set in i18next, set it to the first in our predetermined locale set
            this.selectedLanguage = this.languageOptions[0].locale;
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
