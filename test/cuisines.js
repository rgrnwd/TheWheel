
var assert = require('chai').assert;
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;
var http = require('http');
 
var wheel = require('../public/js/cuisine_wheel');
 
describe('Cuisine Wheel', function() {

	describe('generateColors', function(){

		it('should generate nothing when we ask for 0 colors', function(){
			var colors = wheel.generateColors(0);
			assert.isDefined(colors);
			assert.equal(0, colors.length);
		});

		it('should generate as many colors as we requested', function(){
			var colors = wheel.generateColors(7);
			assert.equal(7, colors.length);
		});

		it('should clear the list of colors when requested twice', function(){
			var colors = wheel.generateColors(7);
			colors = wheel.generateColors(3); // ask again for a different number
			assert.equal(3, colors.length);
		});
	});

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
			response.statusCode = 200;
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
			response.statusCode = 200;
			response.end();

			var request = new PassThrough();
		 
			this.request.callsArgWith(1, response).returns(request);
			wheel.getCuisines(function(err, result) {
				assert.equal(0, result.length);
				done();
			});
		});
		
		it('should handle error response', function(done) {
			var response = new PassThrough();
			response.statusCode = 400;
			response.end();

			var request = new PassThrough();
		 
			this.request.callsArgWith(1, response).returns(request);
			wheel.getCuisines(function(err, result) {
				assert.isDefined(err);
				assert.include(err, 'error code: 400', 'error code handled');
				done();
			});

		});

	})
});
