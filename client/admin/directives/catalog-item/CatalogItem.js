import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import template from './CatalogItem.html';
import styles from './CatalogItem.scss';
import Api from '../../../../raml/api.v1.raml';

@Component({
    selector: 'catalog-item', template: template, styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <catalog-item name="CatalogItem" (change)="onChange($event)"></catalog-item>
 */
export default class CatalogItem {

    _router: Router;
    _route: ActivatedRoute;
    _api: Api;

    contracts: Array;
    productCategories: Array;

    productId: string;
    product;

    productImages: Array;
    selectedImage: string;

    constructor(router: Router, route: ActivatedRoute) {
        this._router = router;
        this._route = route;
        this._api = new Api();
    }

    ngOnInit() {
        this.loadContracts();
        this.loadProductCategories();
        this._route.params.subscribe(params => {
            if (params && params.productId) {
                this.loadProduct(params.productId);
            }
        });
    }

    async loadProduct(productId) {
        this.productId = productId;
        this.product = await this._api.products.productId({productId}).get().json();
        this.loadProductImages();

    }

    async loadContracts() {
        this.contracts = await this._api.contracts.get().json();
    }

    loadProductImages() {

        this.productImages = [];
        this.selectedImage = undefined;

        this.product.images.forEach(async(imageId) => {
            let image = await this._api.images.imageId({imageId: imageId}).get().json();
            this.productImages.push(image.imageURL);

            if (imageId === this.product.defaultImageId) {
                this.selectedImage = image.imageURL;
            }
        });
    }

    async loadProductCategories() {
        this.productCategories = await this._api.categories.get().json();
    }

    async deleteProduct() {
        let response = await this._api.products.productId({productId: this.productId}).delete().json();
        console.log('deleteProduct()', response);
        this._router.navigate(['/admin/catalog']);
    }

    async saveProduct() {
        let response = await this._api.products.productId({productId: this.productId}).put(this.product).json();
        console.log('saveProduct()', response);
        this._router.navigate(['/admin/catalog']);
    }

    replaceImage(/*image*/) {
        alert('Not yet implemented'); //eslint-disable-line
    }

    addImage() {
        alert('Not yet implemented'); //eslint-disable-line
    }
}
