var physics = require('../public/js/physics.js');
var assert = require('chai').assert;

describe('Physics', function() {
    describe('distanceBetweenPoints', function() {
        it('should return 0 when start and end are the same points', function() {
            var point = {x:10,y:10};
            var distance = physics.distanceBetweenPoints(point, point);
            assert.equal(0, distance);
        });
        it('should return difference in x when y values are same', function() {
            var start = {x:5,y:10};
            var end = {x:10,y:10};
            var distance = physics.distanceBetweenPoints(start, end);
            assert.equal(5, distance);
        });
        it('should return difference in y when x values are same', function() {
            var start = {x:10,y:3};
            var end = {x:10,y:10};
            var distance = physics.distanceBetweenPoints(start, end);
            assert.equal(7, distance);
        });
        it('should return correct values when x and y are different', function() {
            var start = {x:1,y:2};
            var end = {x:4,y:6};
            var distance = physics.distanceBetweenPoints(start, end);
            assert.equal(5, distance);
        });
        it('should not return negative distance', function() {
            var start = {x:4,y:6};
            var end = {x:1,y:2};
            var distance = physics.distanceBetweenPoints(start, end);
            assert.equal(5, distance);
        });
    });

    describe('calculateSpinTimeout', function() {
        it('should give default value when distance is 0', function() {
            var spinTimeout = physics.calculateSpinTimeout(0, 10);
            assert.equal(5, spinTimeout);
        });
        it('should give default value when timeTaken is 0', function() {
            var spinTimeout = physics.calculateSpinTimeout(10, 0);
            assert.equal(5, spinTimeout);
        });
        it('should give max value when value exceeds max value', function () {
            var spinTimeout =  physics.calculateSpinTimeout(10, 51);
            assert.equal(5, spinTimeout);
        });
        it('should give timeout based on time and distance', function () {
            var spinTimeout =  physics.calculateSpinTimeout(10, 10);
            assert.equal(1, spinTimeout);
        });
    });

    describe('getArcByAngle', function(){

    	it('should return first arc if only one arc in wheel', function(){
    		var totalArcs = 0;
    		var degreesInRadians = 90 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians, 0);
    		assert.equal(0, arc);
    	});

    	it('should return result on right (3) out of four arcs when we land "on the line" (90 degrees)', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 90 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians, 0);
    		assert.equal(3, arc);
    	});

    	it('should return first out of four arcs for 280 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 280 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians, 0);
    		assert.equal(0, arc);
    	});

    	it('should return second out of four arcs for 190 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 190 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians, 0);
    		assert.equal(1, arc);
    	});
    	
    	it('should return third out of four arcs for 100 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 100 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians, 0);
    		assert.equal(2, arc);
    	});
    	
    	it('should return fourth out of four arcs for 10 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 10 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians, 0);
    		assert.equal(3, arc);
    	});

    });

    describe('getSelectedCuisineIndex', function(){

    	it('should select the first cuisine when it is in the first arc and angled at marker', function(){
    		var totalArcs = 4;
    		var startRadian = 190 * Math.PI / 180;
    		var cuisines = [{'votes': 1}, {'votes': 1}, {'votes': 1}, {'votes': 1}]
    		var index = physics.getSelectedCuisineIndex(cuisines, totalArcs, startRadian);
    		assert.equal(0, index);
    	});

    	it('should select the correct cuisine when there are more arcs than cuisines', function(){
    		var totalArcs = 4;
    		var startRadian = 190 * Math.PI / 180;
    		var cuisines = [{'votes': 2}, {'votes': 1}, {'votes': 1}]
    		var index = physics.getSelectedCuisineIndex(cuisines, totalArcs, startRadian);
    		assert.equal(0, index);
    	});

    	it('should select the correct cuisine when it is angled at marker', function(){
    		var totalArcs = 8;
    		var startRadian = 240 * Math.PI / 180;
    		var cuisines = [{'votes': 2}, {'votes': 1}, {'votes': 2}, {'votes': 2}, {'votes': 1}]
    		var index = physics.getSelectedCuisineIndex(cuisines, totalArcs, startRadian);
    		assert.equal(0, index);
    	});

    	it('should select the correct cuisine when it is angled at another marker', function(){
    		var totalArcs = 12;
    		var startRadian = 30 * Math.PI / 180;
    		var cuisines = [{'votes': 2}, {'votes': 1}, {'votes': 3}, {'votes': 1}, {'votes': 5}]
    		var index = physics.getSelectedCuisineIndex(cuisines, totalArcs, startRadian);
    		assert.equal(4, index);
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