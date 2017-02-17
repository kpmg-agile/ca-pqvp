import {Component, Input, Output, EventEmitter} from '@angular/core';
import Api from '../../../../raml/api.v1.raml';
import template from './SmokeTest.html';
import styles from './SmokeTest.scss';

@Component({
    selector: 'smoke-test', template: template, styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <smoke-test name='SmokeTest' (change)='onChange($event)'></smoke-test>
 */
export default class SmokeTest {
    /**
     * An example input for this directive
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name: string = 'SmokeTest';

    /**
     * An example output for this component
     * @see https://angular.io/docs/ts/latest/api/core/Output-var.html
     */
    @Output() change: EventEmitter = new EventEmitter();

    status: string = 'Pending';

    constructor() {
    }

    async ngOnInit() {
        let api, users;

        this.status += '\nInstantiate API ';
        try {
            api = new Api();
            this.status += '- Success';
        }
        catch (ex) {
            this.status += ex.message;
        }

        this.status += '\nDatabase connection ';
        try {
            users = await api.users.get().json();
            if (users && users.length) {
                this.status += ' - Success';
            }
        }
        catch (ex) {
            this.status += ex.message;
        }
    }

    ngOnChanges() {
        if (this.value) {
            this._element.classList.add('smokeTest');
        }
        else {
            this._element.classList.remove('smokeTest');
        }
    }
}
