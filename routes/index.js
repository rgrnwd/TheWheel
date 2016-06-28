var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config/config');

router.get('/cuisines', function(req, res) {
  var Cuisine = mongoose.model('cuisine');
  var query = Cuisine.find();
  query.exec(function(err, docs) {
    res.json(docs.map(function(doc){
      return {id: doc._id, name: doc.name, emotion: doc.emotion, lastSelected: doc.lastSelected};
    }));
  });
});

router.post('/cuisines/select/:cuisine', function(req, res) {
  var selectedCuisine = req.params.cuisine;
  console.log(selectedCuisine);
  var Cuisine = mongoose.model('cuisine');
  Cuisine.findById(selectedCuisine, function(err, cuisine) {
    if (err) {
      console.error(err);
      res.status(400).end();
    } else {
      cuisine.lastSelected = new Date();
      cuisine.save(function(err) {
        if(err) {
          console.error("Error saving cuisine", err);
          res.status(500).end();
        }
      });
      res.status(200).end();
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'The Wheel' });
});

module.exports = router;
