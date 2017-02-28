import {Component} from '@angular/core';
import {Router} from '@angular/router';
import template from './ProductList.html';
import styles from './ProductList.scss';
import Api from '../../../../raml/api.v1.raml';
import moment from 'moment';
import {UserRoleService} from '../../../app/providers';

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

    PAGE_SIZE:Number = 12;
    POPULAR_LIMIT:Number = 8;

    api = new Api();

    // array of product retrieved from service
    allProducts:Array;
    filteredProducts:Array;
    pagedProducts:Array;
    popularProducts:Array;
    pageIndices:Array<Number>;
    selectedPage:Number;
    categories:Array;

    filter =  { category: null, minPrice: null, maxPrice: null };
    selectedSort:String;
    _comparisonSelections:Array = [];
    _router:Router;
    _userRoleService:UserRoleService;

    constructor(router:Router, userRoleService:UserRoleService) {
        this._router = router;
        this._userRoleService = userRoleService;
    }

    async ngOnInit() {
        this._comparisonSelections = [];
        this.allProducts = await this.api.products.get().json();

        // build the categories
        this.categories = [];
        this.allProducts.forEach((p) => {
            if (!this.categories.includes(p.category)) {
                this.categories.push(p.category);
            }
        });

        // set the initial sort, filter, and paged states
        this.updateUsingFilters();
    }

    filterToCategory(category:string) {
        this.filter.category = category;
        this.updateUsingFilters();
    }

    updateUsingFilters() {
        // filter the products based on the criteria
        this.filteredProducts = this.allProducts.filter( p => {
            return (this.filter.category === null || p.category === this.filter.category) &&
                   (this.filter.minPrice === null || p.unitPrice >=  this.filter.minPrice) &&
                   (this.filter.maxPrice === null || p.unitPrice <=  this.filter.maxPrice);
        });

        // build the page indices
        let pageCount = Math.ceil(this.filteredProducts.length / this.PAGE_SIZE);
        this.pageIndices = Array(pageCount).fill().map((x, i) => i);
        this.selectedPage = this.pageIndices[0];

        // resort the products
        this.updateSort();

        // apply the page
        this.goToPage(this.selectedPage);

        // pull out the popular products for the feature list
        this.popularProducts = this.filteredProducts.filter((p) => p.popular);
        if (this.popularProducts.length > this.POPULAR_LIMIT) {
            this.popularProducts = this.popularProducts.slice(0, this.POPULAR_LIMIT);
        }
    }

    updateSort() {
        const latest = 'latest';
        const oldest = 'oldest';

        if (!this.selectedSort) {
            this.selectedSort = latest;
        }

        if (this.filteredProducts) {
            if (this.selectedSort === latest) {
                this.filteredProducts.sort(this.sortCompareLatest);
            }
            else if (this.selectedSort === oldest) {
                this.filteredProducts.sort(this.sortCompareOldest);
            }
        }

        this.goToPage(this.selectedPage);
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

    goToPage(index) {
        if (index >= 0 && index < this.pageIndices.length) {
            this.selectedPage = index;

            let start = this.selectedPage * this.PAGE_SIZE;
            let end = start + this.PAGE_SIZE;
            this.pagedProducts = this.filteredProducts.slice(start, end);
        }
    }

    goToPreviousPage() {
        this.goToPage(this.selectedPage - 1);
    }

    goToNextPage() {
        this.goToPage(this.selectedPage + 1);
    }
}
