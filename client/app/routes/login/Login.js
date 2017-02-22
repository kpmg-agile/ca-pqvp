import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import template from './Login.html';
import styles from './Login.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'login',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/guide/router.html
 */
export default class Login {

    users:Array<Object>;
    selectedUser:Object;

    constructor(router:Router, route:ActivatedRoute) {
        this._router = router;
        this._route = route;
    }

    async ngOnInit() {
        let api = new Api();
        this.users = await api.users.get().json();
        if (this.users && this.users.length) {
            this.selectedUser = this.users[0].userId;
        }
    }

    async attemptLogin() {

        const password = 'passwd';

        let user = this.users.filter(user => user.userId === this.selectedUser);
        if (user.length) {
            let api = new Api();
            let isLoggedIn = await api.login.post({ userName: user[0].userName, password: password }).json();
            if (isLoggedIn.token) {
                // TODO: branch here on user persmissions for shop vs. admin?
                this._router.navigate(['shop/products']);
            } else {
                // TODO:  show some sort of failure to the user.
            }
        }
    }
}
