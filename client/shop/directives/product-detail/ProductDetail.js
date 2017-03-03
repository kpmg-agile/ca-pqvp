// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

import template from './ProductDetail.html';
import styles from './ProductDetail.scss';
import Api from '../../../../raml/api.v1.raml';
import {CartService} from '../../../app/providers';

@Component({
    selector: 'product-detail',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <product-detail name="ProductDetail" (change)="onChange($event)"></product-detail>
 */
export default class ProductDetail {

    _router:Router;
    _route:ActivatedRoute;
    _cartService:CartService;
    _sanitizer:DomSanitizer;
    _api:Api;

    productId:string;
    product;

    productImages:Array;
    selectedImage;

    quantity:Number = 1;

    constructor(router:Router, route:ActivatedRoute, cartService:CartService, sanitizer:DomSanitizer) {
        this._router = router;
        this._route = route;
        this._cartService = cartService;
        this._sanitizer = sanitizer;
        this._api = new Api();
    }

    ngOnInit() {
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

    async loadProductImages() {

        this.productImages = [];
        this.selectedImage = undefined;

        if (this.product.images && this.product.images.length) {
            this.product.images.forEach( async (imageId) => {
                let image = await this._api.images.imageId({imageId: imageId}).get().json();
                this.productImages.push(image.imageURL);

                if (imageId === this.product.defaultImageId) {
                    this.selectedImage = image.imageURL;
                }
            });
        }
        else {
            let image = await this._api.images.imageId({imageId: 0}).get().json();
            this.productImages.push(image.imageURL);
            this.selectedImage = image.imageURL;
        }
    }

    moveToPreviousImage() {
        let index = this.productImages.indexOf(this.selectedImage);
        index--;

        if (index < 0) {
            index = this.productImages.length - 1;
        }

        this.selectedImage = this.productImages[index];
    }

    moveToNextImage() {
        let index = this.productImages.indexOf(this.selectedImage);
        index++;

        if (index > this.productImages.length - 1) {
            index = 0;
        }

        this.selectedImage = this.productImages[index];
    }

    async addToCart() {
        await this._cartService.addItem(this.product, this.quantity);
        this._router.navigate(['/shop/cart']);
    }
}
