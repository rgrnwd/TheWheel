var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config/config');

router.get('/cuisines', function(req, res) {
  var Cuisine = mongoose.model('cuisine');
  var query = Cuisine.find();
  query.exec(function(err, docs) {
    res.json(docs.map(function(doc){
      return {name: doc.name, emotion: doc.emotion, lastSelected: doc.lastSelected};
    }));
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'The Wheel' });
});

module.exports = router;
