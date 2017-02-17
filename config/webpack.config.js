const config = require('./app.config');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BaseHrefWebpackPlugin = require('base-href-webpack-plugin').BaseHrefWebpackPlugin;
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const entryFiles = fs.readdirSync(path.resolve(__dirname, '../client'));

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
        //the entry files could be js, ts, jsx or tsx
        'vendor': ['babel-polyfill', `./client/${entryFiles.find(f => f.match(/vendor\.(js|jsx|ts|tsx)$/))}`],
        'main': ['babel-polyfill', 'vendor', `./client/${entryFiles.find(f => f.match(/index\.(js|jsx|ts|tsx)$/))}`]
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.json'],
        root: path.resolve(__dirname, '../', 'client'),
        modulesDirectories: [path.resolve(__dirname, '../', 'node_modules')]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['awesome-typescript-loader?configFileName=./config/tsconfig.json&useCache=true&useBabel=true', 'eslint']
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory', 'eslint'],
                exclude: /(node_modules)/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loaders: ['raw', 'css', 'postcss']
            },
            {
                test: /\.scss$/,
                loaders: ['raw', 'postcss', 'sass']
            },
            {
                test: /\.html$/,
                loader: 'raw',
                exclude: ['client/index.html']
            },
            {
                test: /\.raml$/,
                loader: 'raml-client-loader'
            },
            {
                test: /\.svg$/,
                loader: 'raw'
            },
            {
                test: /font.(js|jsx|ts|tsx)$/,
                //https://github.com/DragonsInn/fontgen-loader/issues/30
                loader: 'style!raw!string-replace?search=url%5C("%5C/&replace=url("&flags=gm!fontgen'
            },
            {
                test: /app.config.js$/,
                loader: 'tojson'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
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
        }),
        new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
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
    },

    postcss: () => {
        return [
            require('autoprefixer')({
                browsers: ['last 2 versions']
            })
        ];
    }
};