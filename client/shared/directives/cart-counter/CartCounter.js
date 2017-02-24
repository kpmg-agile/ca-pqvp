import {Component, Input} from '@angular/core';
import template from './CartCounter.html';
import styles from './CartCounter.scss';
import {CartService} from '../../../app/providers';

@Component({
    selector: 'cart-counter',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <cart-counter name="CartCounter" (change)="onChange($event)"></cart-counter>
 */
export default class CartCounter {

    @Input() isFlex:Boolean = false;

    cartService:CartService;

    constructor(cartService:CartService) {
        this.cartService = cartService;
    }
}
