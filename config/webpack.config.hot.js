let config = Object.assign({}, require('./webpack.config'));
let webpack = require('webpack');
let hotEntries = ['webpack-hot-middleware/client?reload=true'];

config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
].concat(config.plugins);

function addHotEntry(entries) {
    if (typeof entries === 'string') {
        return hotEntries.concat(entries);
    }
    else if (entries.concat) {
        return entries.concat(hotEntries);
    }
    else if (typeof entries === 'object') {
        let _entries = {};
        Object.keys(entries).forEach(e => {
            _entries[e] = addHotEntry(entries[e]);
        });
        return _entries;
    }
    return hotEntries;
}

config.entry = addHotEntry(config.entry);

module.exports = config;
