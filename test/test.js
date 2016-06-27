var assert = require('chai').assert;
var wheel = require('../public/js/cuisine_wheel');

describe('Should do something', function() {

  describe('#indexOf()', function () {
    
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });

    // it ('should be something', function(){
    // 	assert.isDefined(wheel);
    // });
  });

});