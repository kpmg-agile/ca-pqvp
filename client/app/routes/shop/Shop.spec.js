import {Component} from '@angular/core';
import Shop from './Shop';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [Shop],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('Shop.js', () => {

    beforeEach(() => {
        addProviders([
            Shop
        ]);
    });

    it('should initialize default name', inject([Shop], (shop:Shop) => {
        expect(shop.name).toBe('Shop');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<shop></shop>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('shop h1').innerText).toBe('Shop');
            });
    })));

});
