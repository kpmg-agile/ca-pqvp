import {Component} from '@angular/core';
import LanguageSelector from './LanguageSelector';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [LanguageSelector],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('LanguageSelector', () => {

    beforeEach(() => {
        addProviders([LanguageSelector]);
    });

    it('should return component name', inject([LanguageSelector], (languageSelector:LanguageSelector) => {
        expect(languageSelector.name).toBe('LanguageSelector');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<language-selector></language-selector>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('language-selector h1').innerText).toBe('LanguageSelector');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<language-selector name="TEST"></language-selector>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('language-selector h1').innerText).toBe('TEST');
            });
    })));

});
