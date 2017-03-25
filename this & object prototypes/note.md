# Type 

## Built-in Object


# 原型对象

```js
    var a = { 
        key1 : undefined;
    }
```

a.key1 //因为找到了key1属性，所以不用走原型链 
a.key2 //继续找原型链，但没有找到，所以返回undefined

但是这两个返回的都是`undefined`, 如何区分是否有这个属性呢？

方法一：in

"key1" in a //有，但不一是a的，有可能是原型链上的。
"key2" in a //没有

>Notice： that `in` will check if a property is in high-level chain, such as `for ... in`

方法二：hasOwnProperty

a.hasOwnProperty("key1") //有，自己就有
a.hasOwnProperty("key2") //自己没有

## __proto__

The strange .__proto__ (not standardized until ES6!) property "magically" retrieves the internal [[Prototype]] of an object as a reference, which is quite helpful if you want to directly inspect (or even traverse: .__proto__.__proto__...) the chain.

## for ... in

对象模拟集合来使用。

```js
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
function ColoredTriangle() {
this.color = 'red';
}

var triangle = {a: 1, b: 2, c: 3};
ColoredTriangle.prototype = triangle;

var obj = new ColoredTriangle();

for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
        console.log('obj.' + prop + ' = ' + obj[prop]);
    } 
}
// "obj.color = red"
```
> for ... of (es6)

```js

...same

for (var k of Object.keys(obj)) {
	console.log('obj.' + k + '=' + obj[k]);
}
```

It may seem a strange omission by ES6, but regular `object`s intentionally do not come with a default *iterator* the way `array`s do. The reasons go deeper than we will cover here. If all you want is to iterate over the properties of an object (with no particular guarantee of ordering), `Object.keys(..)` returns an `array`, which can then be used like `for (var k of Object.keys(obj)) { ..`. Such a `for..of` loop over an object's keys would be similar to a `for..in` loop, except that `Object.keys(..)` does not include properties from the `[[Prototype]]` chain while `for..in` does (see the *this & Object Prototypes* title of this series).

# 随机数生成器

拓展：

```js
var randoms = {
	[Symbol.iterator]: function() {
		return {
			next: function() {
				return { value: Math.random() };
			}
		};
	}
};

var randoms_pool = [];
for (var n of randoms) {
	randoms_pool.push( n );

	// don't proceed unbounded!
	if (randoms_pool.length === 100) break;
}
```
