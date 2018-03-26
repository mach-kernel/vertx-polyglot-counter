var express = require('express');
var router = express.Router();
var ReactDOM = require('react-dom/server');
var counter = require('../components/counter.js');
var React = require('react');

/* GET home page. */
router.get('/', function(req, res, next) {
  var bus = req.app.get('vertx-bus');

  
  bus.send('count-ask', '', function(errask, askres) {
    var reified = React.createElement(
      counter.Counter, { count: askres.body }
    );

    res.render('index', {
      initial: JSON.stringify({'cmpnt-my_counter': { count: askres.body }}),
      component: ReactDOM.renderToString(reified)
    });
  });
});

module.exports = router;
