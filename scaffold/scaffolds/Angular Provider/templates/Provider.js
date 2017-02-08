import {Injectable} from '@angular/core';

/**
 * @example
 * let injector = Injector.resolveAndCreate([{{answers.name}}]);
 * let {{camelCase answers.name}} = new injector.get({{answers.name}});
 * @example
 * class Component {
 * 		constructor({{camelCase answers.name}}:{{answers.name}}, {{camelCase answers.name}}2:{{answers.name}}) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log({{camelCase answers.name}} === {{camelCase answers.name}}2);
 *		}
 * }
 */
@Injectable()
export default class {{answers.name}} {
    constructor() {

    }

    get name():string {
        return '{{answers.name}}';
    }
}
