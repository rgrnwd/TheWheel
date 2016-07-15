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
        console.error("Error", err);
        throw 400;
    });
}

module.exports = {
    saveCuisine: saveCuisine
};