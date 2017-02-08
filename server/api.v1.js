const Router = require('express').Router;
const router = new Router();
//const url = require('url');
//const config = require('../config/app.config');

/**
 * Example 1:
 *
 * Add handler to router to internally handle fetching
 * a user by user id.
 *
 * Use Case:
 *
 * This could be for implementing your own backend logic
 * or to supplement static mocks with dynamic mocks.

router.get('/api/v1/users/:userId', (req, res) => {
    res.json({
        "userId": req.params.userId,
        "firstName": "John (dynamic)",
        "lastName": "Doe",
        "userName": "john.doe"
    });
});*/

/**
 * Example 2:
 *
 * Allow any other "users" requests to fall through to
 * next handler, in this case we will fall through to
 * mocks or proxy/redirect if enabled.
 *
 * Use Case:
 *
 * You may want to do some pre-processing on all
 * user requests and perhaps do some preliminary
 * common work on the request and response object
 * before the next handler gets it.

router.use('/api/v1/users', (req, res, next) => {
    next();
});*/

/**
 * Example 3:
 *
 * Delegate delegate some or all actions another
 * server by means of a proxy. Here we are only
 * setting proxy to calls from /api/v1/errors
 * and down.
 *
 * Use Case:
 *
 * We can setup environment variables to define
 * which server to connect to for the API at runtime.
 *
 * The proxy will allow us to connect the client to
 * the server without the browser reaching across
 * domains which would require CORS to be enabled on
 * the services.

if (config.apiServer) {
    const proxy = require('express-http-proxy');
    router.use('/api/v1/errors', proxy(config.apiServer, {
        intercept: (rsp, data, req, res, callback) => {
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
                callback(null, data);
            }
            catch (e) {
                console.log(e);
            }
        },
        forwardPath: (req) => {
            //forward to proxy with same url including the prefix
            return `${req.baseUrl}${url.parse(req.url).path}`;
        }
    }));
}*/

/**
 * Example 4:
 *
 * Delegate delegate some or all actions another
 * server by means of a redirect. Here we are only
 * setting proxy to calls from /api/v1/login
 * and down.
 *
 * Use Case:
 *
 * We can setup environment variables to define
 * which server to connect to for the API at runtime.
 *
 * The redirect is simpler than the proxy but
 * requires that CORS be enabled on the destination
 * server.

if (config.apiServer) {
    router.use('/api/v1', (req, res) => {
        res.redirect(`${config.apiServer}${req.baseUrl}${url.parse(req.url).path}`);
    });
} */

module.exports = router;
