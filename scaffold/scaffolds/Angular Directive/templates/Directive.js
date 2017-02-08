import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[{{camelCase answers.name}}]'
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Directive-decorator.html
 * @example
 * <div [{{camelCase answers.name}}]="true"></div>
 */
export default class {{camelCase scaffold.name}} {
    /**
     * An example input for this directive
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input('{{camelCase answers.name}}') value:boolean = false;

    constructor(elementRef:ElementRef) {
        this._element = elementRef.nativeElement;
    }

    ngOnChanges() {
        if (this.value) {
            this._element.classList.add('{{camelCase answers.name}}');
        }
        else {
            this._element.classList.remove('{{camelCase answers.name}}');
        }
    }
}
