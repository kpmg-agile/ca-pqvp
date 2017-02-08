const path = require('path');

module.exports = {
    extensions: {
        scripts: '.js',
        styles: '.scss'
    },
    directories: {
        scaffolds: path.resolve(__dirname, '../scaffold/scaffolds'),
        raml: path.resolve(__dirname, '../raml'),
        modules: path.resolve(__dirname, '../client')
    }
};
