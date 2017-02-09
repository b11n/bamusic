var path = require('path');
var webpack = require('webpack');
var jsonfile = require('jsonfile')


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
            filename: 'scripts/[name]bundle[chunkhash].js',
            publicPath: '/public/',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.UglifyJsPlugin({
                minimize: true
            }),
             new FileListPlugin()


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

        var out = {};
         for (var i=0;i<compilation.chunks.length;i++) {
                out[compilation.chunks[i].name] = compilation.chunks[i].renderedHash;
        }
       var file = 'stats.json'
         
        jsonfile.writeFile(file, out, function (err) {
          console.error(err)
        })

    });
};