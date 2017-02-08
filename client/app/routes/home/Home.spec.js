import {Component} from '@angular/core';
import Home from './Home';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [Home],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('/Home.js', () => {

    beforeEach(() => {
        addProviders([
            Home
        ]);
    });

    it('should initialize default name', inject([Home], (home:Home) => {
        expect(home.name).toBe('Home');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<home></home>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('home h1').innerText).toBe('Home');
            });
    })));

});
