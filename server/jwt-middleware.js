let jwt = require('jsonwebtoken'), unless = require('express-unless'), appConfig = require('../config/app.config');

let jwtMiddleware = {

    authorizeMock: function (req, res, next) {
        req.user = {"firstName": "authorized", "lastName": "user", "password": "passwd", "userName": "authuser", "userId": 1};
        next();
    },

    authorize: function (req, res, next) {

        const NOT_AUTHENTICATED_401 = 401;
        //const NOT_AUTHORIZED_403 = 403;

        const cookie = req.cookies[appConfig.authentication.cookieName];

        if (!cookie) {
            return res.status(NOT_AUTHENTICATED_401).send({
                success: false, message: 'No token provided'
            });
        }

        jwt.verify(cookie, appConfig.authentication.secret, function (err, decoded) {
            if (err) {
                console.log(err);
                return res.status(NOT_AUTHENTICATED_401).json({
                    success: false, message: 'Failed to authenticate token'
                });
            }
            else {
                // save to request for reference
                req.user = decoded;
                next();
            }
        });
    }
};

jwtMiddleware.authorize.unless = unless;
jwtMiddleware.authorizeMock.unless = unless;

module.exports = jwtMiddleware;
