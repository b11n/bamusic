var path = require('path');
var webpack = require('webpack');
module.exports = {

        devtool: 'source-map',
        node: {
            console: true,
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            __filename: true,
            __dirname: true
        },
        entry: {
            index: ['./client/bahome.js'],
        },
        output: {
            path: path.join(__dirname, 'public'),
            filename: 'scripts/[name]bundle.js',
            publicPath: '/public/',
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
           



        ],

        module: {
            loaders: [
                {
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                }

            ]
        }
    };







function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
    compiler.plugin('after-emit', function(compilation, callback) {

    });
};