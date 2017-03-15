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
    entry: { main: 'aurelia-bootstrapper' }, // Note: The aurelia-webpack-plugin will add your app's modules to this bundle automatically
    output: {
        path: path.resolve(bundleOutputDir),
        publicPath: '/dist',
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.ts$/, include: /ClientApp/, use: "ts-loader" },
            { test: /\.html$/, use: ['html-loader'] },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: ['url-loader?limit=100000'] },
            { test: /\.json$/, use: ['json-loader'] }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./wwwroot/dist/vendor-manifest.json')
        }),
        new AureliaPlugin({
            aureliaApp: undefined
        })
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
