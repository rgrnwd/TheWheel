var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var mongoose = require('mongoose');

function saveCuisine(selectedCuisine) {
    var Cuisine = mongoose.model('cuisine');
    Cuisine = Promise.promisifyAll(Cuisine);
    Promise.promisifyAll(Cuisine.prototype);

    return Cuisine.findByIdAsync(selectedCuisine).then(function (cuisine) {
        cuisine.lastSelected = new Date();
        return cuisine.saveAsync().catch(function (err) {
            console.error("Error saving cuisine", err);
            throw 500;
        });
    }).catch(function (err) {
        console.error("Error finding the selected cuisine", err);
        throw 400;
    });
}

function cuisineAlreadySavedForTheWeek() {
    var Cuisine = mongoose.model('cuisine');
    Cuisine = Promise.promisifyAll(Cuisine);
    Promise.promisifyAll(Cuisine.prototype);

    var startOfWeek = moment().startOf('week').subtract(2, 'days'); //Friday 
    if (moment().day() >= 5) 
        startOfWeek = startOfWeek.add(7, 'days');

    console.log('start of week is ', startOfWeek.toDate());

    var startOfWeekInMillis = startOfWeek.valueOf();
    console.log(startOfWeek.format());
    return Cuisine.findAsync().then(function(cuisines) {
        var selectedCuisine = _.find(cuisines, function(cuisine) {
            if (cuisine.lastSelected) {
                console.log('cuisine last selected on: ', cuisine.lastSelected)
                return cuisine.lastSelected.getTime() > startOfWeekInMillis;
            }
            return false;
        });
        return selectedCuisine ? true : false;
    }).catch(function(err) {
        console.error("Error reading cuisines", error);
        throw 500;
    });
}

module.exports = {
    cuisineAlreadySavedForTheWeek: cuisineAlreadySavedForTheWeek,
    saveCuisine: saveCuisine
};