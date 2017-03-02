// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component, Input, SimpleChanges} from '@angular/core';
import template from './ProductRating.html';
import styles from './ProductRating.scss';

@Component({
    selector: 'product-rating',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-rating name="ProductRating" (change)="onChange($event)"></product-rating>
 */
export default class ProductRating {

    @Input() product:Object;

    productRating:Number;

    constructor() {

    }

    /**
     * Change handler used to detect changes to selected item
     * @param {SimpleChanges} changes List of changes being processed on this tick
     * @returns {void}
     */
    ngOnChanges(changes: SimpleChanges): void {

        // the model specifies the rating as a string but we want to setup logic around it as a number.
        if (changes.product) {
            this.productRating = +this.product.amazonNumOfStars;
        }
    }

    setRating($event, rating) {
        // stop the event from triggering a route change
        $event.stopPropagation();
        $event.preventDefault();

        this.product.amazonNumOfStars = rating + '';
        this.productRating = rating;

        // TODO:  possibly call product rating service to update value, if it were implemented in a user specific manner.
    }
}
