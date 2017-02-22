import {Component} from '@angular/core';
import template from './ProductList.html';
import styles from './ProductList.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'product-list',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-list name="ProductList" (change)="onChange($event)"></product-list>
 */
export default class ProductList {

    api = new Api();

    // array or product retrieved from service
    products:Array = [];
    popularProducts:Array = [];
    categories:Array = [];
    filter =  { category: null, minPrice: null, maxPrice: null };

    constructor() {

    }

    async ngOnInit() {
        this.allProducts = await this.api.products.get().json();
        this.categories = [];
        this.allProducts.forEach((p) => {
            if (!this.categories.includes(p.category)) {
                this.categories.push(p.category);
            }
        });
        this.updateUsingFilters();
    }

    filterToCategory(category:string) {
        this.filter.category = category;
        this.updateUsingFilters();
    }

    updateUsingFilters() {
        this.products = this.allProducts.filter( p => {
            return (this.filter.category === null || p.category === this.filter.category) &&
                   (this.filter.minPrice === null || p.unitPrice >=  this.filter.minPrice) &&
                   (this.filter.maxPrice === null || p.unitPrice <=  this.filter.maxPrice);
        });
        this.popularProducts = this.products.filter((p) => p.popular);
    }
}
