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
    morgan = require('morgan'),
    fileUpload = require('express-fileupload'),
    fileUploadRouter = require('./file-upload.router.js');

app.set('port', appConfig.hostPort);
app.use(cookieParser());

app.use(jwtMiddleware.authorize.unless({
    // Regex /^(?!.*\/api).*$/ => any path that does NOT include '/API'
    path: [/^(?!.*\/api).*$/, '/api/v1/users', '/api/v1/login']
}));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload({ safeFileNames: true }));  // strips '.' so extension is lost
app.use(fileUpload());
app.use(fileUploadRouter);

if (appConfig.logging.morganParameter) {
    app.use(morgan(appConfig.logging.morganParameter));
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

// // TEMPORARY PROTOTYPE
// // TODO move to module
// // TODO ntegrate with API at /api/v1/images/upload
// app.post('/upload', function(req, res) {
//
//     if (!req.files)
//         return res.status(400).send('No files were uploaded.');
//
//     let file = req.files.attachFile;
//
//     file.mv('./client/img/products/product.png', function(err) {
//         if (err)
//             return res.status(500).send(err);
//
//         res.send('File uploaded!');
//     });
// });



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

