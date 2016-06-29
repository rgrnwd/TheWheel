var http = require('http');
var requestPromise = require('request-promise');
var url = require('./url.js');

module.exports = {
    getCuisines: getCuisines,
    saveCuisineForTheWeek: saveCuisineForTheWeek
};

function getCuisines() {
    var options = {
        uri: url.getBaseUrl() + '/cuisines',
        json: true
    };
    return requestPromise.get(options);
}

function saveCuisineForTheWeek(cuisine) {
    var options = {
        uri: url.getBaseUrl() + '/cuisines/select/' + cuisine.id
    };

    return requestPromise.post(options)
}
