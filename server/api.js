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
        path = require('path'),
        ospreyMock = require('osprey-mock-service'),
        fs = require('fs'),
        url = require('url'),
        raml = require('raml-parser'),
        dir = path.join(__dirname, '../', 'raml'),
        config = require('../config/app.config'),
        files = fs.readdirSync(dir)
            .filter(file => file.endsWith('.raml'));

    return Promise.all(files.map(file => {
        return raml.loadFile(path.join(dir, file)).then(raml => {
            console.log(`registering ${file} on ${raml.baseUri}`);
            try {
                (raml.schemas || []).forEach(schemas => Object.keys(schemas).forEach(key => osprey.addJsonSchema(JSON.parse(schemas[key]), key)));
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
                    if (config.apiServer) {
                        const proxy = require('express-http-proxy');
                        const serverUrl = url.parse(config.apiServer);

                        console.log(`proxying ${raml.baseUri} to ${config.apiServer}`);

                        app.use(raml.baseUri, proxy(serverUrl.host, {
                            https: serverUrl.protocol === 'https:',
                            intercept: (rsp, data, req, res, callback) => {
                                switch (rsp.statusCode.toString()) {
                                    case '404':
                                    case '299':
                                        console.warn(`${config.apiServer}${req.baseUrl}${url.parse(req.url).path} not implemented, redirecting to mock`);
                                        res.redirect(`/mock${req.baseUrl}${url.parse(req.url).path}`);
                                        return;
                                    default:
                                        //we all good
                                        break;
                                }

                                if (res._headers['set-cookie']) {
                                    //fix any set cookie headers specific to the proxied domain back to the local domain
                                    let localDomain = req.headers.host.substr(0, req.headers.host.indexOf(':') || req.headers.length),
                                        proxyDomain = url.parse(config.apiServer).host;

                                    res._headers['set-cookie'] = JSON.parse(JSON.stringify(res._headers['set-cookie']).replace(proxyDomain, localDomain));
                                }

                                if (res._headers['location']) {
                                    //fix any location headers back to app root rather than relative
                                    res.location('/' + res._headers['location']);
                                    res.end();
                                    return;
                                }

                                try {
                                    callback(null, data);// eslint-disable-line callback-return
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            },
                            forwardPath: (req) => {
                                //forward to proxy with same url including the prefix
                                return `${serverUrl.path}${req.baseUrl}${url.parse(req.url).path}`;
                            }
                        }));

                        //host mocks with a mock prefix in the url if using proxy api server
                        app.use('/mock' + raml.baseUri, ospreyMock(raml));
                    }
                    else {
                        //no proxy server, host mocks directly on base URI
                        app.use(raml.baseUri, ospreyMock(raml));
                    }
                    console.log(`registered ${file} on ${raml.baseUri}`);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }));

};
