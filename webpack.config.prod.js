const config = require('./webpack.config')
const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')



module.exports = Object.assign({}, config, {

  devtool: 'source-map',

  plugins: config.plugins.concat([
    new CleanWebpackPlugin([
      path.join(__dirname, 'dist', 'js'),
    ]),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
  ]),

  devServer: {},

})

