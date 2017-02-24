import {Component, trigger, state, style, transition, animate} from '@angular/core';
import template from './MainHeader.html';
import styles from './MainHeader.scss';
import Api from '../../../../raml/api.v1.raml';
import {Router} from '@angular/router';
import {CartService} from '../../../app/providers';

@Component({
    selector: 'main-header',
    template: template,
    styles: [styles],
    animations: [
        trigger('blockerVisible', [
            state('open', style({
                opacity: '1'
            })),
            state('closed', style({
                opacity: '0'
            })),
            transition('open => closed', animate('250ms ease-in')),
            transition('closed => open', animate('250ms ease-out'))
        ]),
        trigger('menuSlide', [
            state('open', style({
                right: '0px'
            })),
            state('closed', style({
                right: '-230px'
            })),
            transition('open => closed', animate('250ms ease-in')),
            transition('closed => open', animate('250ms ease-out'))
        ])
    ]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <main-header name="MainHeader" (change)="onChange($event)"></main-header>
 */
export default class MainHeader {

    CLOSED_STATE:String = 'closed';
    OPEN_STATE:String = 'open';

    cartService:CartService;
    isSlideMenuOpen:Boolean = false;
    menuAnimationState:String = this.CLOSED_STATE;

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
        this.isSlideMenuOpen = true;
        this.menuAnimationState = this.OPEN_STATE;
    }

    closeMenu() {
        this.menuAnimationState = this.CLOSED_STATE;
    }

    onCloseComplete() {
        if (this.menuAnimationState === this.CLOSED_STATE) {
            this.isSlideMenuOpen = false;
        }
    }
}
