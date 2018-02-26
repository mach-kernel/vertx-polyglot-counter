const path = require('path')
const webpack = require('webpack')

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
        // exclude: /node_modules/,
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src/main/js')
    ]
  },
  mode: 'development',
  plugins: [
    new webpack.IgnorePlugin(/^vertx/)
  ]
}

var clientConfig = {
  name: "client",
  entry: path.join(__dirname, 'src/main/js/client.js'),
  output: {
    path: path.join(__dirname, 'build/js'),
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
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src/main/js')
    ]
  },
}

module.exports = [serviceConfig, clientConfig]