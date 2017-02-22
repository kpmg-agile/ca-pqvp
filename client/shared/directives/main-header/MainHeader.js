import {Component, Input, Output, EventEmitter} from '@angular/core';
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

    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'MainHeader';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change:EventEmitter = new EventEmitter();

    async logout() {
        let api = new Api();
        await api.login.delete();
        this.router.navigate(['/']);
    }

    constructor(router:Router, cartService:CartService) {
        this.router = router;
        this.cartService = cartService;
        this.cartService.fetchCart();
    }
}
