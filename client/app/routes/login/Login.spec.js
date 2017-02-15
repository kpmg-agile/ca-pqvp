import {Component} from '@angular/core';
import Login from './Login';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [Login],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('Login.js', () => {

    beforeEach(() => {
        addProviders([
            Login
        ]);
    });

    it('should initialize default name', inject([Login], (login:Login) => {
        expect(login.name).toBe('Login');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, '<login></login>')
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('login h1').innerText).toBe('Login');
            });
    })));

});
