const HtmlReporter = require('protractor-jasmine2-html-reporter');
const path = require('path');
const reportPath = path.resolve(__dirname, '../', 'reports', 'protractor');
const config = require('./app.config');
const cp = require('child_process');

module.exports.config = {
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['disable-extensions']
        }
    },

    frameworks:['jasmine'],

    specs: [
        '../client/*e2e.js'
    ],

    baseUrl: process.env.PROTRACTOR_BASE_URL || `http://localhost:${config.hostPort}`,

    directConnect: true,

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },

    plugins : [
        {
            path: path.resolve(__dirname, '..', 'node_modules', 'protractor-istanbul-plugin'),
            outputPath: path.resolve(__dirname, '..', 'reports', 'protractor', 'coverage')
        }
    ],

    beforeLaunch: () => {
        //start the server that will host the app for testing
        process.env.NODE_ENV = 'test';
        const child = cp.fork(path.resolve(__dirname, '..', 'server', 'index.js'));
        process.on('exit', () => {
            child.kill('SIGINT');
        });

        //delay to give server a chance to boot up
        return new Promise(resolve => setTimeout(resolve, 5000));
    },

    onPrepare: () => {
        const reporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new HtmlReporter({
            savePath: reportPath + '/',
            filePrefix: 'index'
        }));
        jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: reportPath,
            filePrefix: 'junit'
        }));
    }
};
