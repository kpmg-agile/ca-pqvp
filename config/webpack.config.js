const config = require('./app.config');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BaseHrefWebpackPlugin = require('base-href-webpack-plugin').BaseHrefWebpackPlugin;
//const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
//const HtmlElementsPlugin = require('./html-elements-plugin');

module.exports = {
    context: path.resolve(__dirname, '../'),
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        publicPath: '',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },
    metadata: {},
    entry: {
        'vendor': ['babel-polyfill', './client/vendor.js'],
        'main': ['babel-polyfill', 'vendor', './client/index.js']
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.json'],
        root: path.resolve(__dirname, '../', 'client'),
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel?cacheDirectory', 'eslint'],
                exclude: /(node_modules)/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loaders: ['raw', 'css']
            },
            {
                test: /\.scss$/,
                loaders: ['raw', 'sass']
            },
            {
                test: /\.html$/,
                loader: 'raw',
                exclude: ['client/index.html']
            },
            {
                test: /\.raml$/,
                loader: 'raml-client-loader'
            }
        ]
    },
    plugins: [
        //new ForkCheckerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2,
            chunks: ['vendor', 'main']
        }),
        new CopyWebpackPlugin([{
            from: 'client',
            to: './'
        }]),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            chunks: ['common', 'vendor', 'main'],
            chunksSortMode: 'auto'
        }),
        new BaseHrefWebpackPlugin({
            baseHref: config.baseUrl
        })
        /*,
        new HtmlElementsPlugin({
            headTags: require('./head-config.common')
        })*/
    ],
    node: {
        global: 'window',
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    },
    devtool: 'source-map',

    eslint: {
        configFile: path.join(__dirname, '../', '.eslintrc')
    }
};
