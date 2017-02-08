module.exports = function (config) {
    require('./karma.config')(config);
    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
