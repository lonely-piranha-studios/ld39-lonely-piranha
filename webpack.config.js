const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')



module.exports = {

  name: 'game',

  context: path.join(__dirname, 'src'),
  entry: {
    game: './main.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].[hash:8].js',
  },

  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: [
        /node_modules\/sscd/
      ],
    }, {
      test: /\.json$/,
      use: 'json-loader',
    }, {
      test: /\.txt$/,
      use: 'raw-loader',
    }]
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      filename: path.join(__dirname, 'dist', 'index.html'),
    }),
  ],

  resolve: {
    alias: {
      ecs: 'yagl-ecs',
      pixi: 'pixi.js',
    },
    modules: ['node_modules', path.join(__dirname, 'src')]
  },

  devServer: {
    port: 1337,
    clientLogLevel:     'error',
    contentBase:        'dist',
    historyApiFallback: true,
    compress:           true,
    hot:                true,
    quiet:              true,
  }

}

