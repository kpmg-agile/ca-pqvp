let jwt = require('jsonwebtoken'), unless = require('express-unless');

let jwtMiddleware = {

    authorizeMock: function (req, res, next) {
        req.user = {"firstName": "authorized", "lastName": "user", "password": "passwd", "userName": "authuser", "userId": 1};
        next();
    },

    authorize: function (req, res, next) {

        const NOT_AUTHENTICATED_401 = 401;
        //const NOT_AUTHORIZED_403 = 403;

        const superSecret = "Super Secret";

        // Authorization: Bearer <token>
        if (!req.cookies.authorization) {
            return res.json({error: 'Authorization cookie not found'});
        }

        const token = req.cookies.authorization;

        if (token) {

            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    console.log(err);
                    return res.status(NOT_AUTHENTICATED_401).json({
                        success: false, message: 'Failed to authenticate token.'
                    });
                }
                else {
                    // save to request for reference
                    req.user = decoded;
                    console.log('AUTHENTICATED:', req.user);
                    next();
                }
            });

        }
        else {

            return res.status(NOT_AUTHENTICATED_401).send({
                success: false, message: 'No token provided.'
            });

        }
    }
};

jwtMiddleware.authorize.unless = unless;
jwtMiddleware.authorizeMock.unless = unless;

module.exports = jwtMiddleware;
