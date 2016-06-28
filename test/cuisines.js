
var assert = require('chai').assert;
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;
var http = require('http');
 
var wheel = require('../public/js/cuisine_wheel');
 
describe('Cuisine Wheel', function() {

	describe('getCuisines', function(){
		beforeEach(function() {
		this.request = sinon.stub(http, 'request');
	});
 
	afterEach(function() {
		http.request.restore();
	});
 
	it('should get list of cuisines', function(done) {
		var expected = [{"name": "Cuisine1"},{"name": "Cuisine2"},{"name": "Cuisine3"}];
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
	 
		var request = new PassThrough();
	 
		this.request.callsArgWith(1, response).returns(request);
	 
		wheel.getCuisines(function(err, result) {

			assert.equal(3, result.length);
			done();
		});
	});

	it('should handle empty list of cuisines', function(done) {
		var response = new PassThrough();
		response.write(JSON.stringify('[]'));
		response.end();

		var request = new PassThrough();
	 
		this.request.callsArgWith(1, response).returns(request);
	 	console.log('here we go');
		wheel.getCuisines(function(err, result) {
			assert.equal(0, result.length);
			done();
		});
	});
	})
});
