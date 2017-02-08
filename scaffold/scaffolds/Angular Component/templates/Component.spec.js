import {Component} from '@angular/core';
import {{answers.name}} from './{{answers.name}}';
import {
    addProviders,
    async,
    inject,
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
xdescribe('{{answers.name}}', () => {

    beforeEach(() => {
        addProviders([{{answers.name}}]);
    });

    it('should return component name', inject([{{answers.name}}], ({{camelCase answers.name}}:{{answers.name}}) => {
        expect({{camelCase answers.name}}.name).toBe('{{answers.name}}');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<{{hyphenCase answers.name}}></{{hyphenCase answers.name}}>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('{{hyphenCase answers.name}} h1').innerText).toBe('{{answers.name}}');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<{{hyphenCase answers.name}} name="TEST"></{{hyphenCase answers.name}}>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('{{hyphenCase answers.name}} h1').innerText).toBe('TEST');
            });
    })));

});
