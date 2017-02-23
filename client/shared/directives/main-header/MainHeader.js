import {Component} from '@angular/core';
import template from './MainHeader.html';
import styles from './MainHeader.scss';
import Api from '../../../../raml/api.v1.raml';
import {Router} from '@angular/router';
import {CartService} from '../../../app/providers';


@Component({
    selector: 'main-header',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <main-header name="MainHeader" (change)="onChange($event)"></main-header>
 */
export default class MainHeader {

    cartService:CartService;

    constructor(router:Router, cartService:CartService) {
        this.router = router;
        this.cartService = cartService;
    }

    ngOnInit() {
        this.cartService.fetchCart();
    }

    async logout() {
        let api = new Api();
        await api.login.delete();
        this.router.navigate(['/']);
    }
}
