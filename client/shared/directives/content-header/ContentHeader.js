import {Component, trigger, state, style, transition, animate} from '@angular/core';
import {Router} from '@angular/router';
import template from './ContentHeader.html';
import styles from './ContentHeader.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'content-header',
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
 * <content-header></content-header>
 */
export default class ContentHeader {

    CLOSED_STATE:String = 'closed';
    OPEN_STATE:String = 'open';

    isSlideMenuOpen:Boolean = false;
    menuAnimationState:String = this.CLOSED_STATE;

    router:Router

    constructor(router:Router) {
        this.router = router;
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
