// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

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
