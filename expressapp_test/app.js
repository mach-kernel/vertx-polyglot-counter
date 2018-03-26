var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var app = express();
var hash = require('object-hash');

var EventBus = require('vertx3-eventbus-client');

// react caching setup
var componentOptimization = require("react-ssr-optimization");

var componentOptimizationRef = componentOptimization({
    components: {
      'Counter': hash
    },
    lruCacheSettings: {
        max: 10000,  //The maximum size of the cache
    }
});

componentOptimizationRef.enable(true);

// event bus setup
var bus = new EventBus('http://localhost:8080/eventbus');
bus.enableReconnect(true);

bus.onopen = function() {
  console.log('connected to vertx');
  app.set('vertx-bus', bus);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(err.message);
});

module.exports = app;
