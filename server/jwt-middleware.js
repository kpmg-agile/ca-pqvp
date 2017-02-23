const jwt = require('jsonwebtoken'), unless = require('express-unless'), fs = require('fs'), appConfig = require('../config/app.config'), authConfig = JSON.parse(fs.readFileSync('config/auth.config.json', 'utf8'));

let jwtMiddleware = {

    authorize: function (req, res, next) {

        const NOT_AUTHENTICATED_401 = 401;
        //const NOT_AUTHORIZED_403 = 403;

        const cookie = req.cookies[appConfig.authentication.cookieName];

        if (!cookie) {
            return res.status(NOT_AUTHENTICATED_401)
                      .json({
                          success: false, message: 'No token provided'
                      });
        }

        return jwt.verify(cookie, authConfig.secret, function (err, decoded) {
            if (err) {
                console.log(err);
                return res.status(NOT_AUTHENTICATED_401)
                          .json({
                              success: false, message: 'Failed to authenticate token'
                          });
            }
            else {
                // save user object to request for reference from API functions
                req.user = decoded;
                return next();
            }
        });
    }
};

jwtMiddleware.authorize.unless = unless;
module.exports = jwtMiddleware;
