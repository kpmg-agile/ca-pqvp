import {Component} from '@angular/core';
import ProductCart from './ProductCart';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [ProductCart],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('ProductCart', () => {

    beforeEach(() => {
        addProviders([ProductCart]);
    });

    it('should return component name', inject([ProductCart], (productCart:ProductCart) => {
        expect(productCart.name).toBe('ProductCart');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<product-cart></product-cart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('product-cart h1').innerText).toBe('ProductCart');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<product-cart name="TEST"></product-cart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('product-cart h1').innerText).toBe('TEST');
            });
    })));

});
