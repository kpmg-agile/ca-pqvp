import {Component} from '@angular/core';
import ProductList from './ProductList';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [ProductList],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('ProductList', () => {

    beforeEach(() => {
        addProviders([ProductList]);
    });

    it('should return component name', inject([ProductList], (productList:ProductList) => {
        expect(productList.name).toBe('ProductList');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<product-list></product-list>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('product-list h1').innerText).toBe('ProductList');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<product-list name="TEST"></product-list>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('product-list h1').innerText).toBe('TEST');
            });
    })));

});
