import {Component} from '@angular/core';
import {{answers.name}} from './{{answers.name}}';
import {
    inject,
    async,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [{{answers.name}}],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('{{scaffold.name}}', () => {

    it('should initialize default value', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<div {{camelCase answers.name}}></div>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('[{{camelCase answers.name}}]').classList.contains('{{camelCase answers.name}}')).toBe(false);
            });
    })));

    it('should initialize custom value', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<div {{camelCase answers.name}}="true"></div>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('[{{camelCase answers.name}}]').classList.contains('{{camelCase answers.name}}')).toBe(true);
            });
    })));

});
