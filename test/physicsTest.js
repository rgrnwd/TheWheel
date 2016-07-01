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



    describe('getTotalVotes', function() {

    	it('should have zero votes if array is empty', function(){
    		var cuisines = [];
    		var votes = physics.getTotalVotes(cuisines);
    		assert.equal(0, votes);
    	});

    	it('should have one vote for array with one item and one vote', function(){
    		var cuisines = [{'votes': 1}];
    		var votes = physics.getTotalVotes(cuisines);
    		assert.equal(1, votes);
    	});

    	it('should aggregate votes for of all items in array', function(){
    		var cuisines = [{'votes': 1}, {'votes': 3}, {'votes':2}];
    		var votes = physics.getTotalVotes(cuisines);
    		assert.equal(6, votes);
    	});
    });
});