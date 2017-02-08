//TODO: change to false for angular
browser.ignoreSynchronization = true;

describe(`sample test`, () => {
    beforeEach(done => {
        browser.get('/').then(done);
    });

    it(`page should have a title`, () => {
        expect(browser.driver.getTitle()).toBe('Webstart3');
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
