import {Component} from '@angular/core';
import {Router} from '@angular/router';
import template from './ProductList.html';
import styles from './ProductList.scss';
import Api from '../../../../raml/api.v1.raml';
import moment from 'moment';

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
    selectedSort:String;
    _comparisonSelections:Array = [];
    _router:Router;

    constructor(router:Router) {
        this._router = router;
    }

    async ngOnInit() {
        this._comparisonSelections = [];
        this.allProducts = await this.api.products.get().json();
        this.categories = [];
        this.allProducts.forEach((p) => {
            if (!this.categories.includes(p.category)) {
                this.categories.push(p.category);
            }
        });
        this.updateUsingFilters();
        this.updateSort();
    }

    filterToCategory(category:string) {
        this.filter.category = category;
        this.updateUsingFilters();
    }

    updateUsingFilters() {
        // filter the products based on the criteria
        this.products = this.allProducts.filter( p => {
            return (this.filter.category === null || p.category === this.filter.category) &&
                   (this.filter.minPrice === null || p.unitPrice >=  this.filter.minPrice) &&
                   (this.filter.maxPrice === null || p.unitPrice <=  this.filter.maxPrice);
        });

        // resort the products
        this.updateSort();

        // pull out the popular products for the feature list
        this.popularProducts = this.products.filter((p) => p.popular);
    }

    updateSort() {
        const latest = 'latest';
        const oldest = 'oldest';

        if (!this.selectedSort) {
            this.selectedSort = latest;
        }

        if (this.products) {
            if (this.selectedSort === latest) {
                this.products.sort(this.sortCompareLatest);
            }
            else if (this.selectedSort === oldest) {
                this.products.sort(this.sortCompareOldest);
            }
        }
    }

    sortCompareLatest(first, second) {
        let firstDate = moment(first.dateAdded);
        let secondDate = moment(second.dateAdded);
        let result = 0;

        if (firstDate.isAfter(secondDate)) {
            result = -1;
        } else if (firstDate.isBefore(secondDate)) {
            result = 1;
        }

        return result;
    }

    sortCompareOldest(first, second) {
        let firstDate = moment(first.dateAdded);
        let secondDate = moment(second.dateAdded);
        let result = 0;

        if (firstDate.isAfter(secondDate)) {
            result = 1;
        } else if (firstDate.isBefore(secondDate)) {
            result = -1;
        }

        return result;
    }

    compareToggled({product, compare}) {
        if (compare) {
            this._comparisonSelections.push(product.productId);
        } else {
            this._comparisonSelections = this._comparisonSelections.filter( (id) => id !== product.productId );
        }
    }

    goToComparison() {
        let compareString = this._comparisonSelections.join('-');
        //console.log('ProductList.goToComparison: ' + compareString);
        this._router.navigate(['/shop/compare', compareString]);
    }
}
