const vm = require('vm');
const ploc = require('pseudoloc');

module.exports = function(source) {
	this.cacheable && this.cacheable();
	let value = typeof source === 'string' ? JSON.parse(source) : source;
    Object.keys(value).forEach( (key) => {
        value[key] = ploc.str(value[key]);
    });
    return JSON.stringify(value);
};