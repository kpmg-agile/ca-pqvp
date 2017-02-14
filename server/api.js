/**
 * Reads the RAML root directory for any *.raml files and loads
 * a middleware server for each for validation and fallback
 * mock responses. If we find a matching *.js file for the given
 * *.raml file in this directory, we will register it as part
 * of the middleware between validation and mocks.
 *
 * @param {*} app The express server app to register to
 * @returns {void}
 */
module.exports = function(app) {

    let osprey = require('osprey'),
        url = require('url'),
        path = require('path'),
        ospreyMock = require('osprey-mock-service'),
        fs = require('fs'),
        raml = require('raml-parser'),
        dir = path.join(__dirname, '../', 'raml'),
        files = fs.readdirSync(dir)
            .filter(file => file.endsWith('.raml'));

    return Promise.all(files.map(file => {
        return raml.loadFile(path.join(dir, file)).then(raml => {
            let baseUri = url.parse(raml.baseUri).path;
            console.log(`registering ${file} on ${baseUri}`);
            try {
                app.use(raml.baseUri, osprey.server(raml));
                try {
                    //if there is a matching JS file for the RAML file initialize it against the app
                    //ex - api.v1.raml checks for api.v1.js here
                    app.use(require(path.join(__dirname, file.substr(0, file.lastIndexOf('.')))));
                }
                catch (e) {
                    console.log(e);
                }
                finally {
                    app.use(baseUri, ospreyMock(raml));
                    console.log(`registered ${file} on ${baseUri}`);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }));

};
