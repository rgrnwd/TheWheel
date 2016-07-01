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

    describe('getArcByAngle', function(){

    	it('should return first arc if only one arc in wheel', function(){
    		var totalArcs = 0;
    		var degreesInRadians = 90 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians);
    		assert.equal(0, arc);
    	});

    	it('should return result on right (3) out of four arcs when we land "on the line" (90 degrees)', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 90 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians);
    		assert.equal(3, arc);
    	});

    	it('should return first out of four arcs for 280 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 280 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians);
    		assert.equal(0, arc);
    	});

    	it('should return second out of four arcs for 190 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 190 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians);
    		assert.equal(1, arc);
    	});
    	
    	it('should return third out of four arcs for 100 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 100 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians);
    		assert.equal(2, arc);
    	});
    	
    	it('should return fourth out of four arcs for 10 degrees angle', function(){
    		var totalArcs = 4;
    		var degreesInRadians = 10 * Math.PI / 180;
    		var arc = physics.getArcByAngle(totalArcs, degreesInRadians);
    		assert.equal(3, arc);
    	});

    });

    describe('getSelectedCuisineIndex', function(){

    	it('should select the first cuisine when it is in the first arc and angled at marker', function(){
    		var totalArcs = 4;
    		var startRadian = 280 * Math.PI / 180;
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
    		var totalArcs = 12;
    		var startRadian = 120 * Math.PI / 180;
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