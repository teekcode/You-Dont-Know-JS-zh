# prototype

    var a = { 
        key1 : 2;
    }

    a.key1 //needn't to consider prototype
    a.key2 //need to consider prototype


# for ... in

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in

    var triangle = {a: 1, b: 2, c: 3};

    function ColoredTriangle() {
    this.color = 'red';
    }

    ColoredTriangle.prototype = triangle;

    var obj = new ColoredTriangle();

    for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
        console.log('obj.' + prop + ' = ' + obj[prop]);
    } 
    }

    // Output:
    // "obj.color = red"
