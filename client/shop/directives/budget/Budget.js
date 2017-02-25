import {Component, Input} from '@angular/core';
import template from './Budget.html';
import styles from './Budget.scss';
import moment from 'moment';
import Api from '../../../../raml/api.v1.raml';
import i18next from 'i18next';

@Component({
    selector: 'budget',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <budget name="Budget" (change)="onChange($event)"></budget>
 */
export default class Budget {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Budget';

    _api:Api;

    constructor() {
        this._api = new Api();
        i18next.on('languageChanged', () => { this.loadMonthNames(); });
    }

    myOrders:Array = [];
    amountPerMonth:Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    aggregatedByMonth:Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthNames:Array = ['', '', '', '', '', '', '', '', '', '', '', ''];

    async ngOnInit() {
        this.amountPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.aggregatedByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.myOrders = await this._api.orders.get().json();

        this.myOrders.forEach( (order) => {
            let month = moment(order.dateCreated).month();
            this.amountPerMonth[month] += order.totalCost;
            for (let i = 11; i >= month; i--) {
                this.aggregatedByMonth[i] += order.totalCost;
            }
        });

        this.loadMonthNames();
    }

    loadMonthNames() {
        for (let i = 0; i < 12; i++) {
            this.monthNames[i] = i18next.t('month' + i);
        }
    }
}
