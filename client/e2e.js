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
