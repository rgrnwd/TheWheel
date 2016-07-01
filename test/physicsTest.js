var physics = require('../public/js/physics.js');
var assert = require('chai').assert;

describe('Physics', function() {
    describe('distanceBetweenPoints', function() {
        it('should return 0 when start and end are the same points', function() {
            // var point = {x:10,y:10};
            // var distance = physics.distanceBetweenPoints(point, point);
            // assert.equal(0, distance);
        });
    });

    describe('getCuisineFromSelectedArc', function(){

    	it('should return -1 if no cuisines', function(){
    		var cuisines = [];
    		var index = physics.getCuisineFromSelectedArc(cuisines, 4);
    		assert.equal(-1, index);
    	});

    	it('should return last cuisines if list of cuisines is greater than arc given', function(){
    		var cuisines = [{'votes':1}];
    		var index = physics.getCuisineFromSelectedArc(cuisines, 4);
    		assert.equal(0, index);
    	});

    	it('should return selected cuisine if arcs and cuisines are the same length', function(){
    		var cuisines = [{'votes':1}, {'votes':1}, {'votes':1}];
    		var index = physics.getCuisineFromSelectedArc(cuisines, 2);
    		assert.equal(2, index);
    	});

    	it('should return second cuisine if 3rd arc is given and first cuisine equals two arcs', function(){
    		var cuisines = [{'votes':2}, {'votes':1}];
    		var index = physics.getCuisineFromSelectedArc(cuisines, 2);
    		assert.equal(1, index);
    	});

    	it('should return first cuisine if 3rd arc is given and first cuisine equals three arcs', function(){
    		var cuisines = [{'votes':3}, {'votes':1}];
    		var index = physics.getCuisineFromSelectedArc(cuisines, 2);
    		assert.equal(0, index);
    	});
    });

    describe('calculateArc', function(){
    	it ('should calculate the arc when given 0', function(){
    		var length = 0;
    		var expectedArc = Math.PI / (length * 0.5);

    		var result = physics.calculateArc(length);
    		assert.equal(expectedArc, result);
    	});
    	it ('should calculate the arc based on the length given', function(){
    		var length = 5;
    		var expectedArc = Math.PI / (length * 0.5);

    		var result = physics.calculateArc(length);
    		assert.equal(expectedArc, result);
    	});
    })
});