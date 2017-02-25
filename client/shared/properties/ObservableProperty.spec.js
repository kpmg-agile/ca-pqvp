import ObservableProperty from './ObservableProperty';

// TODO: test it as a function not a class
xdescribe('ObservableProperty', () => {

    let observableProperty;

    beforeEach(() => {
        observableProperty = new ObservableProperty();
    });

    it('should return a valid name', () => {
        expect(observableProperty.name).toBe('ObservableProperty');
    });

    afterEach(() => {
        observableProperty = null;
    });

});
