/*
Complete the solution so that it strips all text that follows any of a set of comment markers passed in. Any whitespace at the end of the line should also be stripped out.

Example:

Given an input string of:

apples, pears # and bananas
grapes
bananas !apples

The output expected would be:

apples, pears
grapes
bananas

The code would be called like so:

var result = solution("apples, pears # and bananas\ngrapes\nbananas !apples", ["#", "!"])
// result should == "apples, pears\ngrapes\nbananas"

*/
function solution(input, markers) {
    var pattern = new RegExp('[' + markers.join('') + ']');
    return input.split('\n').map(i => i.split(pattern)[0].trim()).join('\n');
}

module.exports = solution;