import {Pipe} from '@angular/core';

@Pipe({
    name: '{{camelCase answers.name}}',
    pure: true
})
/**
 * @see https://angular.io/docs/ts/latest/guide/pipes.html
 * @example
 * <div>{{leftBrace}}{{leftBrace}}inputExpression | {{camelCase answers.name}}{{rightBrace}}{{rightBrace}}</div>
 */
export default class {{answers.name}} {
    constructor() {
        //TODO: inject any required dependencies
    }

    transform(input:any, args:Array) {
        //TODO: filter or format your input to provide a new output
        return input;
    }
}
