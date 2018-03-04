var express = require('express');
var router = express.Router();
var ReactDOM = require('react-dom/server');

/* GET home page. */
router.get('/', function(req, res, next) {
  var bus = req.app.get('vertx-bus');

  bus.send('count-ask', '', function(errask, askres) {
    bus.send('ssr', askres.body, function(errssr, ssrres) {
      res.render('index', {
        initial: JSON.stringify({ count: askres.body }),
        component: ssrres.body
      });
    });
  });
});

module.exports = router;
