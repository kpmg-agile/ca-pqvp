import {Component} from '@angular/core';
import Console from './Console';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [Console],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('Console.js', () => {

    beforeEach(() => {
        addProviders([
            Console
        ]);
    });

    it('should initialize default name', inject([Console], (console:Console) => {
        expect(console.name).toBe('Console');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<console></console>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('console h1').innerText).toBe('Console');
            });
    })));

});
