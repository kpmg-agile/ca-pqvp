import {Component} from '@angular/core';
import Admin from './Admin';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [Admin],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('Admin.js', () => {

    beforeEach(() => {
        addProviders([
            Admin
        ]);
    });

    it('should initialize default name', inject([Admin], (admin:Admin) => {
        expect(admin.name).toBe('Admin');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<admin></admin>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('admin h1').innerText).toBe('Admin');
            });
    })));

});
