let express = require('express'),
    compression = require('compression'),
    http = require('http'),
    jwtMiddleware = require('./jwt-middleware'),
    fs = require('fs'),
    path = require('path'),
    dist = path.join(__dirname, '../', 'dist'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    appConfig = require('../config/app.config'),
    app = express(),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan');

app.set('port', appConfig.hostPort);
app.use(cookieParser());

//app.use(jwtMiddleware.authorize.unless({path: '/api/v1/login'}));
app.use(jwtMiddleware.authorize.unless({path: ['/','/api/v1/users', '/api/v1/login'], ext:['js','css','ico','map','woff2','svg','png']}));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(appConfig.logging) {
    app.use(morgan(appConfig.logging));
}

if (fs.existsSync(dist)) {
    console.log('hosting pre-compiled static assets [prod]');
    app.use(serveStatic(dist));
}
else {
    console.log('hosting on-demand compiled dynamic assets [dev]');

    let webpack = require('webpack'),
        webpackConfig = require('../config/webpack.config.hot'),
        webpackHot = require('webpack-hot-middleware'),
        webpackMiddleware = require('webpack-dev-middleware'),
        compiler = webpack(webpackConfig);

    app.use(webpackMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    }));

    app.use(webpackHot(compiler));
}

//register the API
require('./api')(app).then(
    () => {
        let server = http.createServer(app);
        server.listen(appConfig.hostPort, () => {
            if (appConfig.html5HistoryMode) {
                //404 resolution back to index.html for html5 history
                let request = require('request');
                app.get('*', (req, res, next) => {
                    if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('html')) {
                        return req.pipe(request(`${req.protocol}://${req.get('host')}/index.html`)).pipe(res);
                    }
                    return next();
                });
            }
            console.log(`Server running on port ${appConfig.hostPort}`);
        });
    },
    (error) => console.error(error)
);

