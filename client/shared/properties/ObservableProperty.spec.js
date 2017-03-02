// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

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
