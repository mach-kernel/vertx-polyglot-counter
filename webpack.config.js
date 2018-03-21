const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var serviceConfig = {
  name: "service",
  entry: path.join(__dirname, 'src/main/js/template_verticle.js'),
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: "template_verticle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react']
        }
      },
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src/main/js')
    ]
  },
  mode: 'development'
}

var clientConfig = {
  name: "client",
  entry: path.join(__dirname, 'src/main/js/client.js'),
  output: {
    path: path.join(__dirname, 'src/main/resources/webroot'),
    filename: "client.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ],
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src/main/js')
    ]
  },
  mode: 'development'
}

module.exports = [serviceConfig, clientConfig]