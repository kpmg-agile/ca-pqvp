let config = require('./webpack.config');

//used for .babelrc env field to load istanbul
process.env.NODE_ENV = 'test';

/*config.module.preLoaders = [
    {
        test: /\.(js|jsx)$/,
        loaders: ['istanbul-instrumenter'],
        exclude: /(node_modules|spec)/
    }
].concat(config.module.preLoaders || []);*/

//remove the entries, files will be set by karma.config.js
config.entry = {};
config.plugins = [];

module.exports = config;
