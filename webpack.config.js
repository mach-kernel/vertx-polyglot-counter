const path = require('path')
const webpack = require('webpack')

var serviceConfig = {
  name: "service",
  entry: path.join(__dirname, 'src/main/js/template_verticle.js'),
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: "template_verticle.js"
  },
  externals: {
    'vertx-web-js/static_handler': 'commonjs vertx-web-js/static_handler',
    'vertx-web-js/handlebars_template_engine': 'commonjs vertx-web-js/handlebars_template_engine',
    'vertx-web-js/router': 'commonjs vertx-web-js/router'
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
  mode: 'development'
}

var clientConfig = {
  name: "client",
  entry: path.join(__dirname, 'src/main/js/client.js'),
  output: {
    path: path.join(__dirname, 'src/main/resources/webroot/static'),
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
  mode: 'development'
}

module.exports = [serviceConfig, clientConfig]