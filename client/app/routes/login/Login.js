import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import template from './Login.html';
import styles from './Login.scss';

@Component({
    selector: 'login',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/guide/router.html
 */
export default class Login {
    name:string = 'Login';

    constructor(router:Router, route:ActivatedRoute) {
        this._router = router;
        this._route = route;
    }

    ngOnInit() {
        this._route.params.subscribe(params => {
            console.log(params);
            //TODO: you may need to react to parameter changes and fetch data
        });
    }

    attemptLogin() {
        this._router.navigate(['shop/products']);
    }
}
