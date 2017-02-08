import {
    addProviders,
    inject
} from '@angular/core/testing';
import {{answers.name}} from './{{answers.name}}';

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('{{answers.name}}.js', () => {

    beforeEach(() => {
        addProviders([{{answers.name}}]);
    });

    it('should return {{scaffold.name}} instance', inject([{{answers.name}}], ({{camelCase answers.name}}:{{answers.name}}) => {
        expect({{camelCase answers.name}}).toBeDefined();
    }));

    it('should return name', inject([{{answers.name}}], ({{camelCase answers.name}}:{{answers.name}}) => {
        expect({{camelCase answers.name}}.name).toBe('{{answers.name}}');
    }));

});
