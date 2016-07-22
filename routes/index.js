var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config/config');
var cuisineService = require('../app/service/cuisines');

router.get('/cuisines', function(req, res) {
  var Cuisine = mongoose.model('cuisine');
  var query = Cuisine.find();
  query.exec(function(err, docs) {
    res.json(docs.map(function(doc){
      return {id: doc._id, name: doc.name, emotion: doc.emotion, lastSelected: doc.lastSelected, votes: doc.votes};
    }));
  });
});

router.get('/cuisineSelected', function(req, res){

  cuisineService.cuisineAlreadySavedForTheWeek().then(function(selected){
    res.json(selected);
  });
});

router.post('/cuisines/select/:cuisine', function(req, res) {
  cuisineService.cuisineAlreadySavedForTheWeek().then(function(selected) {
    if (!selected) {
      console.log("Cuisine will be saved as this week's selection");
      return cuisineService.saveCuisine(req.params.cuisine);
    }
    console.log("Cuisine for this week has already been saved");
  }).then(function () {
    res.status(200).end();
  }).catch(function (error) {
    res.status(error).end();
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'The Wheel' });
});

module.exports = router;
