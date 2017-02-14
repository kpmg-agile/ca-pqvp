import {Component} from '@angular/core';
import MainFooter from './MainFooter';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [MainFooter],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('MainFooter', () => {

    beforeEach(() => {
        addProviders([MainFooter]);
    });

    it('should return component name', inject([MainFooter], (mainFooter:MainFooter) => {
        expect(mainFooter.name).toBe('MainFooter');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<main-footer></main-footer>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('main-footer h1').innerText).toBe('MainFooter');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<main-footer name="TEST"></main-footer>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('main-footer h1').innerText).toBe('TEST');
            });
    })));

});
