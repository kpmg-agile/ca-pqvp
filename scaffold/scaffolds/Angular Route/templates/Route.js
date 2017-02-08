import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import template from './{{answers.name}}.html';
import styles from './{{answers.name}}{{config.extensions.styles}}';

@Component({
    selector: '{{hyphenCase answers.name}}',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/guide/router.html
 */
export default class {{answers.name}} {
    name:string = '{{answers.name}}';

    constructor(route:ActivatedRoute) {
        this._route = route;
    }

    ngOnInit() {
        this._route.params.subscribe(params => {
            console.log(params);
            //TODO: you may need to react to parameter changes and fetch data
        });
    }
}
