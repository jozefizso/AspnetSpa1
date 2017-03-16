var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
var webpack = require('webpack');
const { AureliaPlugin } = require('aurelia-webpack-plugin');

var bundleOutputDir = './wwwroot/dist';
module.exports = {
    resolve: {
        extensions: [ '.js', '.ts' ],
        modules: ["ClientApp", "node_modules"],
    },
    entry: { 'main': 'aurelia-bootstrapper' }, // Note: The aurelia-webpack-plugin will add your app's modules to this bundle automatically
    output: {
        path: path.resolve(bundleOutputDir),
        publicPath: '/dist',
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.ts$/, include: /ClientApp/, use: "ts-loader" },
            { test: /\.html$/, use: ['html-loader'] },
            // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
            // only when the issuer is a .js/.ts file, so the loaders are not applied inside templates
            // https://github.com/jods4/aurelia-webpack-build/wiki/CSS-doesn't-load
            { test: /\.css$/i, use: 'style-loader', issuer: /\.[tj]s$/i },
            { test: /\.css$/i, use: 'css-loader', issuer: /\.html?$/i },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: ['url-loader?limit=100000'] },
            { test: /\.json$/, use: ['json-loader'] }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
        new webpack.DllReferencePlugin({
            manifest: require('./wwwroot/dist/vendor-manifest.json')
        }),
        new AureliaPlugin()
    ].concat(isDevBuild ? [
        // Plugins that apply in development builds only
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map', // Remove this line if you prefer inline source maps
            moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
        })
    ] : [
        // Plugins that apply in production builds only
        new webpack.optimize.UglifyJsPlugin()
    ])
};
