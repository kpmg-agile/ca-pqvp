import {Injectable} from '@angular/core';
import Api from '../../../../raml/api.v1.raml';


/**
 * @example
 * let injector = Injector.resolveAndCreate([CartService]);
 * let cartService = new injector.get(CartService);
 * @example
 * class Component {
 * 		constructor(cartService:CartService, cartService2:CartService) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log(cartService === cartService2);
 *		}
 * }
 */
@Injectable()
export default class CartService {

    itemCount:number;
    cart;

    _api:Api;
    // TODO: turn this one when the client code can deal with it.
    //_fetchStarted:Boolean = false;

    constructor() {
        this.itemCount = 0;
        this._api = new Api();
    }

    addItem(product, quantity) {
        this.itemCount += quantity;
    }

    async fetchCart() {
        //if (!this._fetchStarted) {
            this._fetchStarted = true;

            this.cart = await this._api.orders.current.get().json();
            if (this.cart && this.cart.orderItems) {
                this.itemCount = this.cart.orderItems.length;
            } else {
                this.itemCount = 0;
            }
        //}
    }

    get name():string {
        return 'CartService';
    }
}
