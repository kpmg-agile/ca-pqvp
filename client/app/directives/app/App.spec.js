// This file was generated from the component scaffold
// Copyright 2016

import {Component} from '@angular/core';
import App from './App';
import {
    inject,
    async,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';
import info from '../../../../package.json';

@Component({
    selector: 'test-component',
    directives: [App],
    template: ''
})
class TestComponent {}

xdescribe('app/App.js', () => {

    let app;

    beforeEach(() => {
        app = new App();
    });

    it('should return module name', () => {
        expect(app.name).toBe(info.name);
    });

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<app></app>`)
            .createAsync(TestComponent)
            .then((fixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('app h1').innerText).toBe('App');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<app name="TEST"></app>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('app h1').innerText).toBe('TEST');
            });
    })));

    afterEach(() => {
        app = null;
    });

});
