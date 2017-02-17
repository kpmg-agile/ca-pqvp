const domainRegExp = /^([A-z]{0,5}:)?\/\/([A-z0-9_\-\.:])\/?/i;
const login = require('./login');

/**
 * Crawls the application with each of the given users starting at the main
 * screen finding any dead links and running a series of canned tests on
 * each page to see if there are common issues, like errors and such.
 *
 * @param {object} options The options to run agains
 * @param {Array<any>} options.users The users to run as (default [{}])
 * @param {Array<Array>} options.resolutions The resolutions to run (default [[1280,720]])
 * @param {Array<string>} options.entries The entry points to start crawling (default ['/'])
 * @returns {void} No return
 */
module.exports = function crawl(options = {}) {
    const users = options.users || [{}];
    const resolutions = options.resolutions || [[1280, 720]];
    const entries = options.entries || ['/'];

    let processed;

    users.forEach(user => {
        resolutions.forEach(resolution => {
            entries.forEach(entry => {
                processed = [];
                describe('crawling the application', () => {

                    const defaultTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

                    beforeEach(done => {
                        //clear browser log
                        browser.driver.manage().logs().get('browser').then(() => {
                            browser.driver.manage().window().setSize(resolution[0], resolution[1]).then(() => {
                                login(user).then(done, done);
                            });
                        });
                    });

                    it(`should crawl '${entry}' as ${JSON.stringify(user)} @ ${JSON.stringify(resolution)} and not find any errors`, done => {
                        testPage(entry, user, resolution).then(done, done);
                    });

                    afterEach(() => {
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = defaultTimeout;
                    });

                });
            });
        });
    });

    /**
     * Is the given log entry an actual error
     * @param {Object} entry The log entry
     * @returns {boolean} True if the given entry is a real error to fail test on page
     */
    function isError(entry) {
        let level = entry.level.name || entry.level;
        return level === 'SEVERE';
    }

    /**
     * Runs the tests for the ven page, user and resolution. Scans the page DOM for any *[href]
     * elements and recurses those page references.
     * @param {string} page The page URL that will be loaded
     * @param {*} user The user to authenticate as
     * @param {Array<int>} resolution The resolution to run the window at
     * @returns {Promise<any>} Promise to complete when page has been tested
     */
    function testPage(page, user, resolution) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL += 5000;
        processed.push(page);
        return browser.get(page).then(() => {
            return browser.getCurrentUrl().then(url => {
                let domain = url.match(domainRegExp)[2];
                processed.push(url);
                return browser.manage().logs().get('browser').then(browserLog => {
                    let errors = browserLog.filter(e => isError(e));
                    expect(JSON.stringify(errors, null, 2)).toBe('[]', `${url} as ${JSON.stringify(user)} @ ${JSON.stringify(resolution)} should not produce any errors`);
                    return element.all(by.css('body [href]')).then(links => {
                        let promises = [];
                        links.forEach((link) => {
                            promises.push(link.getAttribute('href').then(link => {
                                let isProcessed = !!processed.find(p => p === link),
                                    isExternal = /^([A-z]{0,5}:)?\/\//i.test(link) && link.match(domainRegExp)[2] !== domain;

                                return !isProcessed && !isExternal ? testPage(link, user, resolution) : Promise.resolve({});
                            }));
                        });
                        return Promise.all(promises);
                    });
                });
            });
        });
    }
};
