// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

//TODO: change to false for angular
browser.ignoreSynchronization = true;

describe('KPMG CA Prototype', () => {
    beforeEach(done => {
        browser.get('/').then(done);
    });

    it('page should have a title', () => {
        expect(browser.driver.getTitle()).toBe('KPMG\'s CA IT Prototype');
    });
});

const crawl = require('./e2e-helpers/crawl');
crawl({
    users: [
        {
            userId: '123'
        }
    ],
    resolutions: [
        [1280, 720]
    ],
    entries: [
        '/'
    ]
});
