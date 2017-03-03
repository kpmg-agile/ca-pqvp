// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

browser.ignoreSynchronization = true;

function waitForUrlToChangeTo() {
    let currentUrl;
    return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
            currentUrl = url;
        }
    ).then(function waitForUrlToChangeTo() {
            return browser.wait(function waitForUrlToChangeTo() {
                return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
                    return url !== currentUrl;
                });
            });
        }
    );
}

describe('KPMG CA Prototype', () => {
    beforeEach(done => {
        browser.get('/').then(done);
    });

    it('page should have a title', () => {
        expect(browser.driver.getTitle()).toBe('KPMG\'s CA IT Prototype');
    });

    it('should be able to login', done => {
        browser.waitForAngular().then( () => {
            browser.getCurrentUrl().then( (initialUrl) => {
                element(by.css('.login-btn')).click().then( () => {
                    waitForUrlToChangeTo().then( () => {
                        browser.getCurrentUrl().then( () => {
                            done();
                        });
                    });
                });
            });
        });
    });
});

const crawl = require('./e2e-helpers/crawl');
crawl({
    users: [
        {
            userId: 'authorizedUser'
        }
    ],
    resolutions: [
        [1280, 720],
        [320, 568],
        [768, 1024]
    ],
    entries: [
        '/',
        '/shop/products',
        '/shop/orders',
        '/shop/budget',
        '/shop/cart'
    ]
});
