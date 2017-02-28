import {Component, ViewChild, forwardRef} from '@angular/core';
import template from './AdminHeader.html';
import styles from './AdminHeader.scss';
import Api from '../../../../raml/api.v1.raml';
import {Router} from '@angular/router';
import {CartService} from '../../../app/providers';
import {ContentHeader} from '../../../shared/directives';

@Component({
    selector: 'admin-header',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <admin-header></admin-header>
 */
export default class AdminHeader {

    @ViewChild(forwardRef(() => ContentHeader)) contentHeader: ContentHeader;

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

    openMenu() {
        this.contentHeader.openMenu();
    }

    closeMenu() {
        this.contentHeader.closeMenu();
    }
}
