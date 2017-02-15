import {Component} from '@angular/core';
import MainHeader from './MainHeader';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [MainHeader],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('MainHeader', () => {

    beforeEach(() => {
        addProviders([MainHeader]);
    });

    it('should return component name', inject([MainHeader], (mainHeader:MainHeader) => {
        expect(mainHeader.name).toBe('MainHeader');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<main-header></main-header>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('main-header h1').innerText).toBe('MainHeader');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<main-header name="TEST"></main-header>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('main-header h1').innerText).toBe('TEST');
            });
    })));

});
