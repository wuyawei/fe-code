const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'dll.[name]_[hash:6].js',
        library: '[name]_[hash:6]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dist', '[name].manifest.json'),
            name: '[name]_[hash:6]'
        })
    ]
}