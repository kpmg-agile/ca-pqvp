import {Component} from '@angular2/core';
import {{answers.name}} from './{{answers.name}}';
import {
    addProviders,
    inject
} from '@angular/core/testing';

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('{{scaffold.module}}/{{scaffold.name}}.js', () => {

    beforeEach(() => {
        addProviders([{{answers.name}}]);
    });

    it('should return formatted value', inject([{{answers.name}}], ({{camelCase answers.name}}:{{answers.name}}) => {
        expect({{camelCase answers.name}}.transform('foo')).toBe('foo');
    }));

});
