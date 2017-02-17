import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import template from './Console.html';
import styles from './Console.scss';

@Component({
    selector: 'console',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/guide/router.html
 */
export default class Console {
    name:string = 'Console';

    constructor(route:ActivatedRoute) {
        this._route = route;
    }

    ngOnInit() {
        this._route.params.subscribe(params => {
            console.log('Console.ngOnInit() params:', params);
            //TODO: you may need to react to parameter changes and fetch data
        });
    }
}
