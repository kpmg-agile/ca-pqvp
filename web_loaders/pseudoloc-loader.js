const vm = require('vm');
const ploc = require('pseudoloc');

module.exports = function(source) {

    // the standard 'json' loader may run before we do so the 'source' param
    // will be string that looks like "module.exports = {foo:'bar'};"
    //
    // to get the real json value out, we evaluate this string in a node sandbox
    if (typeof source === 'string' && source.startsWith('module.exports')) {
        const sandbox =  { module: {exports: null } };
        vm.runInNewContext(source, sandbox);
        source = sandbox.module.exports;
    }

	this.cacheable && this.cacheable();
	let value = typeof source === 'string' ? JSON.parse(source) : source;
    Object.keys(value).forEach( (key) => {
        value[key] = ploc.str(value[key]);
    });
	this.value = [value];
	return 'module.exports = ' + JSON.stringify(value) + ';';
};