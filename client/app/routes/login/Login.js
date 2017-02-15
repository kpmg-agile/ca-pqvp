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

    // TODO: replace with a service call once the mock services environment is available.
    users:Array = [
        {
            userId: '1234',
            name: 'Auth User'
        },
        {
            userId: '4321',
            name: 'Admin User'
        }
    ];

    selectedUser:any = this.users[0].userId;

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
        // TODO: handle the user selection in some manner for the rest of the app state?
        //let user = this.users.filter(user => user.userId === this.selectedUser);

        this._router.navigate(['shop/products']);
    }
}
