import {{answers.name}} from './{{answers.name}}';

describe('{{answers.name}}', () => {

    let {{camelCase answers.name}};

    beforeEach(() => {
        {{camelCase answers.name}} = new {{answers.name}}();
    });

    it('should return a valid name', () => {
        expect({{camelCase answers.name}}.name).toBe('{{answers.name}}');
    });

    afterEach(() => {
        {{camelCase answers.name}} = null;
    });

});
