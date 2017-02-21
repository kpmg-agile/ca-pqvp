let jwt = require('jsonwebtoken'),
    unless = require('express-unless');

let jwtMiddleware = {

    authorize: function (req, res, next) {

        const NOT_AUTHENTICATED_401 = 401;
        //const NOT_AUTHORIZED_403 = 403;

        const superSecret = "Super Secret";

        // Authorization: Bearer <token>
        if (!req.headers.authorization) {
            return res.json({error: 'No credentials sent!'});
        }

        const token = req.headers.authorization.split(' ')[1];

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
                    console.log('Authenticated User:', req.user);
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
module.exports = jwtMiddleware;
