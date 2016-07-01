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

	describe('rgbToHtml', function(){

		it('should match the required regex for a html color when given a color', function(){
			var htmlColor = colors.rgbToHtml(255, 0, 0);
			assert.match(htmlColor, /^#[0-9a-f]{6}$/);
		});

		it('should generate black when we ask for 0 in each component', function(){
			var htmlColor = colors.rgbToHtml(0, 0, 0);
			assert.equal("#000000", htmlColor);
		});

		it('should generate red when we ask for a red component only', function(){
			var htmlColor = colors.rgbToHtml(255, 0, 0);
			assert.equal("#ff0000", htmlColor);
		});

		it('should generate green when we ask for a green component only', function(){
			var htmlColor = colors.rgbToHtml(0, 255, 0);
			assert.equal("#00ff00", htmlColor);
		});

		it('should generate blue when we ask for a blue component only', function(){
			var htmlColor = colors.rgbToHtml(0, 0, 255);
			assert.equal("#0000ff", htmlColor);
		});

		it('should give white if given an invalid color', function(){
			var htmlColor = colors.rgbToHtml(256, 255, 255);
			assert.equal("#ffffff", htmlColor);
		});
	});

	describe('componentToHex', function() {

		it('should convert -1 (decimal) to -1 (hex)', function() {
			var hex = colors.componentToHex(-1);
			assert.equal("-1", hex);
		});

		it('should convert 0 (decimal) to 0 (hex)', function() {
			var hex = colors.componentToHex(0);
			assert.equal("0", hex);
		});

		it('should convert 255 (decimal) to ff (hex)', function() {
			var hex = colors.componentToHex(255);
			assert.equal("ff", hex);
		});

		it('should convert 256 (decimal) to 100 (hex)', function() {
			var hex = colors.componentToHex(256);
			assert.equal("100", hex);
		});

		it('should convert 4095 (decimal) to fff (hex)', function() {
			var hex = colors.componentToHex(4095);
			assert.equal("fff", hex);
		});

		it('should convert 0 (decimal) to 00 (hex) when required length is 2', function() {
			var hex = colors.componentToHex(0, 2);
			assert.equal("00", hex);
		});

		it('should convert 0 (decimal) to 00f (hex) when required length is 3', function() {
			var hex = colors.componentToHex(15, 3);
			assert.equal("00f", hex);
		});

		it('should convert 10 (decimal) to 00000a (hex) when a long length is required', function() {
			var hex = colors.componentToHex(10, 6);
			assert.equal("00000a", hex);
		});
	});
});
