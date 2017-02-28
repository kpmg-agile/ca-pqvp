import {Component, ViewChild, forwardRef} from '@angular/core';
import template from './MainHeader.html';
import styles from './MainHeader.scss';
import Api from '../../../../raml/api.v1.raml';
import {Router} from '@angular/router';
import {CartService, OrderService} from '../../../app/providers';
import {ContentHeader} from '../../../shared/directives';

@Component({
    selector: 'main-header',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <main-header></main-header>
 */
export default class MainHeader {

    @ViewChild(forwardRef(() => ContentHeader)) contentHeader: ContentHeader;

    cartService:CartService;
    orderService:OrderService;

    isOrdersExpanded:Boolean = false;
    groupedOrders:Array;

    constructor(router:Router, cartService:CartService, orderService:OrderService) {
        this.router = router;
        this.cartService = cartService;
        this.orderService = orderService;
    }

    ngOnInit() {
        this.cartService.fetchCart();

        this.orderService.groupedOrdersObservable.subscribe((values) => { this.onGroupedOrdersChanged(values.currentValue); });
        this.orderService.fetchOrders();
        if (this.orderService.groupedOrders && this.orderService.groupedOrders.length) {
            this.onGroupedOrdersChanged(this.orderService.groupedOrders);
        }
    }

    onGroupedOrdersChanged(groupedOrders) {
        // pull the set of orders out of the service
        this.groupedOrders = groupedOrders;
    }

    async logout() {
        let api = new Api();
        await api.login.delete();
        this.router.navigate(['/']);
    }

    openMenu() {
        this.contentHeader.openMenu();
    }

    closeMenu() {
        this.contentHeader.closeMenu();
    }

    toggleOrdersDrawer($event) {
        // stop the event from triggering a route change
        $event.stopPropagation();
        $event.preventDefault();

        this.isOrdersExpanded = !this.isOrdersExpanded;
    }
}
