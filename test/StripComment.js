var chai = require('chai');
chai.should();

let StripComment = require('../codewars/StripComment');

let result_demo = StripComment.f("apples, pears # and bananas\ngrapes\nbananas !apples", ["#", "!"]);

describe('String', function() {
  describe('#Stripe comment', function() {
    it('should strip all comment', function() {
        result_demo.should.equal("apples, pears\ngrapes\nbananas");
    });
  });
});