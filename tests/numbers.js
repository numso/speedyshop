var assert = require('assert');

/////////////////////////////////////////////////////
/// Your Code Starts Here!! /////////////////////////
/////////////////////////////////////////////////////

var numbers = [];
for (var i = 0; i <= 10; ++i) {
    numbers[i] = function () {
        return i;
    };
}

/////////////////////////////////////////////////////
/// Your Code Ends Here!! ///////////////////////////
/////////////////////////////////////////////////////

assert.equal(numbers[5](), 5);

assert.equal(numbers[10](), 10);

console.log("Success!")