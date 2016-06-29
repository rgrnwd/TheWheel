var assert = require('chai').assert;
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
});
