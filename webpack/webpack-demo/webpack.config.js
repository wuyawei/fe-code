const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: './src/pages/app/main.js',
        home: './src/pages/home/index.js',
        util: './src/common/utils.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.ProvidePlugin({util: require.resolve('./src/common/utils.js')}),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: './index.html',
            chunks: ['index', 'util'], // 需要引入的代码块
            hash: true,
            minify: {
                removeAtrributeQuotes: true
            }
        }),
        new HtmlWebpackPlugin({
            title: 'home',
            filename: 'home.html',
            template: './index.html',
            chunks: ['home', 'util'], // 需要引入的代码块
            hash: true,
            minify: {
                removeAtrributeQuotes: true
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: 'img/[name].[ext]',
                            publicPath: './'
                        }
                    }
                ]
            }
        ]
    }
};