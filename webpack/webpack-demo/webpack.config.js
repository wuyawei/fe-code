const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // css压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // js压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const InlineScriptPlugin = require('./plugins/inline-script-plugin');
const isDev = process.env.NODE_ENV !== 'production'; // 有个坑 set NODE_ENV=production&&前面不能加空格
module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        index: './src/pages/app/main.js',
        // home: './src/pages/home/index.js',
        util: './src/common/utils.js'
        // test: './src/pages/test/index.js'
    },
    output: {
        path: resolve('dist'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.json', '.scss', '.css'],
        // 设置别名
        alias: {
            '@': resolve('src'),// 这样配置后 @ 可以指向 src 目录
            'static': resolve('static')
        }
    },
    resolveLoader: { // 配置loader查找路径
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
    },
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true // 找不到正确资源的指向 index.html
    },
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             cache: true,
    //             parallel: true,
    //             sourceMap: false // set to true if you want JS source maps
    //         }),
    //         // new OptimizeCSSAssetsPlugin({})
    //     ]
    // },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     manifest: require(path.join(__dirname, 'vendor.manifest.json'))
        // }),
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({util: require.resolve('./src/common/utils.js')}),
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
        // new HtmlWebpackPlugin({
        //     title: 'home',
        //     filename: 'home.html',
        //     template: './index.html',
        //     chunks: ['home', 'util'], // 需要引入的代码块
        //     hash: true,
        //     minify: {
        //         removeAtrributeQuotes: true
        //     }
        // }),
        // new HtmlWebpackPlugin({
        //     title: 'test',
        //     filename: 'test.html',
        //     template: './index.html',
        //     chunks: ['test'], // 需要引入的代码块
        //     hash: true,
        //     minify: {
        //         removeAtrributeQuotes: true
        //     }
        // }),
        // new InlineScriptPlugin({ // js内联插件
        //     regSrc: /\/(.*?\.bundle\.js?).*/ // 匹配js名称
        // }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // extract-text-webpack-plugin  生成css文件
        // new ExtractTextPlugin({
        //     filename: 'css/[name].[contenthash].css',
        //     allChunks: true
        // })
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash].css',
            chunkFilename: 'css/[name]-[contenthash].css'
        })
    ],
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader?minimize' // css-loader?minimize css压缩
            //     ]
            // },
            // extract-text-webpack-plugin 将程序中的多个.css|.less|.scss文件,单独打包成一个.css文件.
            // {
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //       use: ['css-loader', 'less-loader']
            //     })
            // },
            // webpack 4 以后推荐使用 mini-css-extract-plugin  
            // 这个插件应该只用在 production 配置中，并且在loaders链中不使用 style-loader, 
            // 特别是在开发中使用HMR，因为这个插件暂时不支持HMR
            {
                test: /\.css$/,
                use: [
                  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                  'css-loader?minimize' // css压缩
                ],
            },
            {
                test: /\.scss/, // 把scss转为webpack可识别的模块
                exclude: /node_modules/,
                loaders: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['react-hot-loader/babel'], // 热更新插件
                            presets: [['@babel/preset-env', {modules: false}], '@babel/preset-react'], // jsx转为js函数
                        }
                    },
                    {
                        loader: 'test-loader',
                        options: {
                            content: '测试一下'
                        }
                    }

                ]
            },
            {
                test: /\.(png|svg|jpg|gif|flv)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: '[name][hash].[ext]',
                            outputPath: 'static/'
                        }
                    }
                ]
            }
        ]
    }
};