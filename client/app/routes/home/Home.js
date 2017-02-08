import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import template from './Home.html';
import styles from './Home.scss';

@Component({
    selector: 'home',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/guide/router.html
 */
export default class Home {
    name:string = 'Home';

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
