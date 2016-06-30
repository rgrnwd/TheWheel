var assert = require('chai').assert;
var http = require('http');
 
var colors = require('../public/js/colors.js');
 
describe('Colors', function() {

	describe('generateColors', function(){

		it('should generate nothing when we ask for 0 colors', function(){
			var generatedColors = colors.generateColors(0);
			assert.isDefined(generatedColors);
			assert.equal(0, generatedColors.length);
		});

		it('should generate as many colors as we requested', function(){
			var generatedColors = colors.generateColors(7);
			assert.equal(7, generatedColors.length);
		});

		it('should clear the list of colors when requested twice', function(){
			var generatedColors = colors.generateColors(7);
			generatedColors = colors.generateColors(3); // ask again for a different number
			assert.equal(3, generatedColors.length);
		});
	});
});
