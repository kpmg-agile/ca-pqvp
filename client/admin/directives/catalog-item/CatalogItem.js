// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import $ from 'jquery';

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

    $fileInput:Object;
    replacingImage:Object;

    constructor(router: Router, route: ActivatedRoute) {
        this._router = router;
        this._route = route;
        this._api = new Api();
    }

    async ngOnInit() {
        await this.loadContracts();
        await this.loadProductCategories();

        this._route.params.subscribe(params => {
            if (params && params.productId) {
                if (params.productId === 'new') {
                    // we are creating a new product
                    this.product = {
                        unitPrice: 0,
                        msrp: 0,
                        discount: 0,
                        contractorId: this.contracts[0].contractorId,
                        category: this.productCategories[0].name,
                        images: []
                    };
                    this.productImages = [];
                }
                else {
                    // we are editing an existing product
                    this.loadProduct(params.productId);
                }
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

    async loadProductImages() {

        this.productImages = [];
        this.selectedImage = undefined;

        if (this.product.images && this.product.images.length) {
            this.product.images.forEach(async(imageId) => {
                let image = await this._api.images.imageId({imageId: imageId}).get().json();
                this.productImages.push(image);

                if (imageId === this.product.defaultImageId) {
                    this.selectedImage = image.imageURL;
                }
            });
        }
        else {
            let image = await this._api.images.imageId({imageId: 0}).get().json();
            this.productImages.push(image);
            this.selectedImage = image.imageURL;
        }
    }

    async loadProductCategories() {
        this.productCategories = await this._api.categories.get().json();
    }

    async deleteProduct() {
        let response = await this._api.products.productId({productId: this.productId}).delete();
        console.log('deleteProduct()', response);
        if (response.status === 204) {
            this._router.navigate(['/admin/catalog']);
        }
        else {
            // there was a failure in the service
            // TODO:
        }
    }

    async saveProduct() {
        let response;
        if (this.productId) {
            // put an existing product
            response = await this._api.products.productId({productId: this.productId}).put(this.product).json();
        }
        else {
            // post a new product
            response = await this._api.products.post(this.product).json();
        }
        console.log('saveProduct()', response);
        this._router.navigate(['/admin/catalog']);
    }

    activateInput(selector) {
        this.$fileInput = $(selector);
        this.$fileInput.click();
    }

    replaceImage(image) {
        this.replacingImage = image;
        this.activateInput('#ReplaceImageInput');
    }

    async replaceImageSelected() {
        let files = this.$fileInput[0].files;
        let image = await this.uploadImageFile(files[0]);
        let replacingIndex = this.productImages.indexOf(this.replacingImage);
        this.productImages[replacingIndex] = image;
        this.product.images[replacingIndex] = image.imageId;

        if (replacingIndex === 0) {
            this.selectedImage = image.imageURL;
        }
    }

    addImage() {
        this.activateInput('#NewImageInput');
    }

    async addImageSelected() {
        let files = this.$fileInput[0].files;
        let image = await this.uploadImageFile(files[0]);
        console.log('addImageSelection(): ', image);
        this.productImages.push(image);
        this.product.images.push(image.imageId);

        if (!this.selectedImage) {
            this.selectedImage = image.imageURL;
        }
    }

    async uploadImageFile(fileInfo) {
        let imgData = new FormData();
        imgData.append('attachFile', fileInfo);

        return $.ajax({
            url: 'upload?productId=' + this.productId,
            type: 'POST',
            data: imgData,
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (image) {
                return image;
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log('uploadImageFile() ' + textStatus, errorThrown, jqXHR);
                return null;
            }
        });
    }
}
