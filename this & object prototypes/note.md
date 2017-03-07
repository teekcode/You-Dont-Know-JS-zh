# Type 

## Built-in Object


# prototype

    var a = { 
        key1 : 2;
    }

    a.key1 //needn't to consider prototype
    a.key2 //need to consider prototype

# __proto__

We can also directly retrieve the [[Prototype]] of an object. As of ES5, the standard way to do this is:

Object.getPrototypeOf( a );
And you'll notice that object reference is what we'd expect:

Object.getPrototypeOf( a ) === Foo.prototype; // true
Most browsers (not all!) have also long supported a non-standard alternate way of accessing the internal [[Prototype]]:

a.__proto__ === Foo.prototype; // true
The strange .__proto__ (not standardized until ES6!) property "magically" retrieves the internal [[Prototype]] of an object as a reference, which is quite helpful if you want to directly inspect (or even traverse: .__proto__.__proto__...) the chain.

Just as we saw earlier with .constructor, .__proto__ doesn't actually exist on the object you're inspecting (a in our running example). In fact, it exists (non-enumerable; see Chapter 2) on the built-in Object.prototype, along with the other common utilities (.toString(), .isPrototypeOf(..), etc).

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

# for ... of

 It may seem a strange omission by ES6, but regular `object`s intentionally do not come with a default *iterator* the way `array`s do. The reasons go deeper than we will cover here. If all you want is to iterate over the properties of an object (with no particular guarantee of ordering), `Object.keys(..)` returns an `array`, which can then be used like `for (var k of Object.keys(obj)) { ..`. Such a `for..of` loop over an object's keys would be similar to a `for..in` loop, except that `Object.keys(..)` does not include properties from the `[[Prototype]]` chain while `for..in` does (see the *this & Object Prototypes* title of this series).