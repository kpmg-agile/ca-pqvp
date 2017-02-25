import {Component, Input} from '@angular/core';
import template from './Dashboard.html';
import styles from './Dashboard.scss';
// import moment from 'moment';
import Api from '../../../../raml/api.v1.raml';
// import i18next from 'i18next';

@Component({
    selector: 'dashboard',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <dashboard name="Dashboard" (change)="onChange($event)"></dashboard>
 */
export default class Dashboard {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Dashboard';

    _api:Api;

    constructor() {
        this._api = new Api();
        // i18next.on('languageChanged', () => { this.loadMonthNames(); });
    }

    users:Array = [];

    async ngOnInit() {
        this.users = await this._api.users.get().json();
        console.log('Dashboard.ngOnInit() users:', this.users);

        this.users = this.users.map(function(u){
            u.fullName = u.firstName + ' ' + u.lastName;
            return u;
        });

        // this.myOrders.forEach( (order) => {
        //     let month = moment(order.dateCreated).month();
        //     this.amountPerMonth[month] += order.totalCost;
        //     for (let i = 11; i >= month; i--) {
        //         this.aggregatedByMonth[i] += order.totalCost;
        //     }
        // });

        // this.loadMonthNames();
    }

    // loadMonthNames() {
    //     for (let i = 0; i < 12; i++) {
    //         this.monthNames[i] = i18next.t('month' + i);
    //     }
    // }
}
