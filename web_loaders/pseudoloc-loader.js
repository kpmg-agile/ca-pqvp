const ploc = require('pseudoloc');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

module.exports = function() {
	this.cacheable && this.cacheable();

    // get config values from the query parameter
    let config = querystring.parse(this.query.replace('?', ''));

    // load the strings to convert
    const defaultStringsPath = path.resolve(__dirname,
        `../client/locales/${config.lng}/${config.ns}.json`);
    this.addDependency(defaultStringsPath);
    let defaultStrings = fs.readFileSync(defaultStringsPath, 'utf-8');

    defaultStrings = JSON.parse(defaultStrings);

    // apply pseudoloc to each string
    let pseudoStrings = {};
    Object.keys(defaultStrings).forEach( (key) => {
        pseudoStrings[key] = ploc.str(defaultStrings[key]);
    });

    this.value = [pseudoStrings];
    return 'module.exports=' + JSON.stringify(pseudoStrings);
};