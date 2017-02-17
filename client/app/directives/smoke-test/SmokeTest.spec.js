import {Component} from '@angular/core';
import SmokeTest from './SmokeTest';
import {
    inject,
    async,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [SmokeTest],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('', () => {

    it('should initialize default value', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<div smokeTest></div>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('[smokeTest]').classList.contains('smokeTest')).toBe(false);
            });
    })));

    it('should initialize custom value', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<div smokeTest="true"></div>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('[smokeTest]').classList.contains('smokeTest')).toBe(true);
            });
    })));

});
