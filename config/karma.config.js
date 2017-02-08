// Karma configuration
// Generated on Fri Sep 02 2016 04:51:33 GMT-0400 (EDT)

const path = require('path');
const reportDir = path.join(__dirname, '../', 'reports');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            //'node_modules/babel-polyfill/dist/polyfill.js',
            'client/spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            //'**/*.js': ['sourcemap'],
            //'**/*.jsx': ['sourcemap'],
            'client/spec.js': ['webpack']
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        plugins: [
            'karma-*',
            {
                'middleware:reports': ['factory', function () {
                    let serveStatic = require('serve-static'),
                        path = require('path');
                    return serveStatic(path.resolve(__dirname, '../', 'reports'));
                }]
            }
        ],

        reporters: ['progress', 'coverage', 'html', 'junit'],
        coverageReporter: {
            dir: path.join(reportDir, 'karma'),
            useBrowserName: false,
            reporters: [
                {
                    type: 'json',
                    subdir: function() { return 'coverage'; }
                }
            ]
        },
        junitReporter: {
            outputDir: path.join(reportDir, 'karma'),
            outputFile: 'junit.xml',
            useBrowserName: false
        },
        htmlReporter: {
            outputDir: reportDir,
            middlePathDir: 'karma'
        },

        webpack: require('./webpack.config.karma'),
        webpackMiddleware: {},

        middleware: ['reports']
    });
};
