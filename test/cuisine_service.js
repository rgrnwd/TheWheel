var assert = require('chai').assert;
var requestPromise = require('request-promise');
var sinon = require('sinon');
require('sinon-as-promised');
var http = require('http');
var url = require('../public/js/url.js');
var service = require('../public/js/cuisine_service.js');

describe('Cuisine Service', function() {
    beforeEach(function() {
        this.request = sinon.stub(http, 'request');
        sinon.stub(url, 'getBaseUrl').returns('http://somehost');
    });

    afterEach(function() {
        http.request.restore();
        url.getBaseUrl.restore();
    });

    describe('getCuisines', function(){

        it('should call the correct api to retrieve cuisines', function() {
            sinon.stub(requestPromise, 'get').withArgs({uri: 'http://somehost/cuisines', json: true}).resolves('result');
            return service.getCuisines().then(function(result) {
                assert.isTrue(result === 'result');
                requestPromise.get.restore();
            });
        });
        it('should return error if the request errors', function() {
            sinon.stub(requestPromise, 'get').withArgs({uri: 'http://somehost/cuisines', json: true}).rejects('Something went wrong');
            return service.getCuisines().catch(function(error) {
                assert.isTrue(error.message === 'Something went wrong');
                requestPromise.get.restore();
            });
        });
    });

    describe('saveCuisineForTheWeek', function() {
        var cuisineId = "1234567";

        it('should post data to the correct api', function() {
            sinon.stub(requestPromise, 'post').withArgs({uri: 'http://somehost/cuisines/select/' + cuisineId}).resolves();

            return service.saveCuisineForTheWeek({id: cuisineId}).then(function(result) {
                assert.isUndefined(result);
                requestPromise.post.restore();
            });
        });
        it('should return error if the request errors', function() {
            sinon.stub(requestPromise, 'post').withArgs({uri: 'http://somehost/cuisines/select/' + cuisineId}).rejects('Something went wrong');
            return service.saveCuisineForTheWeek({id: cuisineId}).catch(function(error) {
                assert.isTrue(error.message === 'Something went wrong');
                requestPromise.post.restore();
            });
        });
    });
});
