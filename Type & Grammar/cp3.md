b0de181  on 13 Jul 2016 @mmmaaatttttt mmmaaatttttt small typo fix

<!-- TOC -->

- [You Don't Know JS: Types & Grammar](#you-dont-know-js-types--grammar)
- [Chapter 3: Natives](#chapter-3-natives)
    - [Internal `[[Class]]`](#internal-class)
    - [Boxing Wrappers](#boxing-wrappers)
        - [Object Wrapper Gotchas](#object-wrapper-gotchas)
    - [Unboxing](#unboxing)
    - [Natives as Constructors](#natives-as-constructors)
        - [`Array(..)`](#array)
        - [`Object(..)`, `Function(..)`, and `RegExp(..)`](#object-function-and-regexp)
        - [`Date(..)` and `Error(..)`](#date-and-error)
        - [`Symbol(..)`](#symbol)
        - [Native Prototypes](#native-prototypes)
            - [Prototypes As Defaults(原型作为初始值)](#prototypes-as-defaults原型作为初始值)
    - [Review](#review)

<!-- /TOC -->

#You Don't Know JS: Types & Grammar
#Chapter 3: Natives

在前面两章我们提到了几个内置类型，通常叫做natives，像String和Numer。让我们来深究一下。

这是一份常用natives的列表：

    String()
    Number()
    Boolean()
    Array()
    Object()
    Function()
    RegExp()
    Date()
    Error()
    Symbol() -- added in ES6!

所以你会发现，这些natives是内置的函数。

如果你学了java之后来看javascript, js的String()看起来像用来创建字符串的构造函数，所以你会这样做：

    var s = new String( "Hello World!" );

    console.log( s.toString() ); // "Hello World!"

确实，这样做没错，但构造的内容和你想的有可能不一样。

    var a = new String( "abc" );

    typeof a; // "object" ... not "String"

    a instanceof String; // true

    Object.prototype.toString.call( a ); // "[object String]"


The result of the constructor form of value creation (new String("abc")) is an object wrapper around the primitive ("abc") value.

更重要的是， `typeof`表明这些对象的类型不是他们自己的类型，而更像是object的子类型。

这些对象的包装能够这样被察觉：

    console.log( a );

上面这句语句输出什么由你的浏览器决定，因为开发者的控制台能自由地为开发者选择他们认为合适的序列化对象的方式。

Note: At the time of writing, the latest Chrome prints something like this: String {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}. But older versions of Chrome used to just print this: String {0: "a", 1: "b", 2: "c"}. The latest Firefox currently prints String ["a","b","c"], but used to print "abc" in italics, which was clickable to open the object inspector. Of course, these results are subject to rapid change and your experience may vary.

但关键是，new String("abc")创建了一个字符串包装对象，而不是有些人认为的仅仅是原始字符串的值。

## Internal `[[Class]]`

使用`typeof`得到`object`(比如array)的那些值都会有一个内部属性`[[Class]]`(把这个看作是一个内部分类方法，和传统类编程无关)。这个属性不能被直接访问到，但可以用`Object.prototype.toString(..)`间接访问：

```js
Object.prototype.toString.call( [1,2,3] );			// "[object Array]"

Object.prototype.toString.call( /regex-literal/i );	// "[object RegExp]"
```

所以，在上面这个例子里，array的内部属性`[[Class]]`的值是`"Array"`; 对于正则表达式，是`"RegExp"`.在大部分情况下，这个内部属性和内建原生构造函数一致，但也有例外。

那原始类型呢？`null` 和 `undefined`:

```js
Object.prototype.toString.call( null );			// "[object Null]"
Object.prototype.toString.call( undefined );	// "[object Undefined]"
```

你或许知道，没有`Null()`或者`Undefined()`原生构造函数，但没关系,`[[Class]]`属性的值就是如上的两个。

但像简单的原始类型，比如`string`,`number`,`boolean`, 会被一种叫做boxing的包装起来。(详见下一节的"Boxing Wrappers")

```js
Object.prototype.toString.call( "abc" );	// "[object String]"
Object.prototype.toString.call( 42 );		// "[object Number]"
Object.prototype.toString.call( true );		// "[object Boolean]"
```

在上面这个片段代码中，每个原始类型的值都自动被他们各自的wrapper包装来的了。所以各自的`[[Class]]`才会有对应的值。

**注意：** 这里的`toString()`方法和`[[Class]]`内部属性从es5到es6有所变化，但我们会在*ES6 & Beyond*里面介绍。

## Boxing Wrappers

这些object wrappers充当了非常重要的作用。primitive值没有属性和方法，所以想要使用`.length`和`.toString()`你需要一个object wrapper来包装这个值。有幸的是，js自动帮我们做了这件事。

```js
var a = "abc";

a.length; // 3
a.toUpperCase(); // "ABC"
```

So, if you're going to be accessing these properties/methods on your string values regularly, like a `i < a.length` condition in a `for` loop for instance, it might seem to make sense to just have the object form of the value from the start, so the JS engine doesn't need to implicitly create it for you.

But it turns out that's a bad idea. Browsers long ago performance-optimized the common cases like `.length`, which means your program will *actually go slower* if you try to "preoptimize" by directly using the object form (which isn't on the optimized path).

In general, there's basically no reason to use the object form directly. It's better to just let the boxing happen implicitly where necessary. In other words, never do things like `new String("abc")`, `new Number(42)`, etc -- always prefer using the literal primitive values `"abc"` and `42`.

### Object Wrapper Gotchas

There are some gotchas with using the object wrappers directly that you should be aware of if you *do* choose to ever use them.

For example, consider `Boolean` wrapped values:

```js
var a = new Boolean( false );

if (!a) {
	console.log( "Oops" ); // never runs
}
```

The problem is that you've created an object wrapper around the `false` value, but objects themselves are "truthy" (see Chapter 4), so using the object behaves oppositely to using the underlying `false` value itself, which is quite contrary to normal expectation.

如果你想手动包装一个原始值，你可以使用`Object(..)`函数。（且不要用`new`）

```js
var a = "abc";
var b = new String( a );
var c = Object( a );

typeof a; // "string"
typeof b; // "object"
typeof c; // "object"

b instanceof String; // true
c instanceof String; // true

Object.prototype.toString.call( b ); // "[object String]"
Object.prototype.toString.call( c ); // "[object String]"
```

Again, using the boxed object wrapper directly (like `b` and `c` above) is usually discouraged, but there may be some rare occasions you'll run into where they may be useful.

## Unboxing

If you have an object wrapper and you want to get the underlying primitive value out, you can use the `valueOf()` method:

```js
var a = new String( "abc" );
var b = new Number( 42 );
var c = new Boolean( true );

a.valueOf(); // "abc"
b.valueOf(); // 42
c.valueOf(); // true
```

Unboxing can also happen implicitly, when using an object wrapper value in a way that requires the primitive value. This process (coercion) will be covered in more detail in Chapter 4, but briefly:

```js
var a = new String( "abc" );
var b = a + ""; // `b` has the unboxed primitive value "abc"

typeof a; // "object"
typeof b; // "string"
```

## Natives as Constructors

For `array`, `object`, `function`, and regular-expression values, it's almost universally preferred that you use the literal form for creating the values, but the literal form creates the same sort of object as the constructor form does (that is, there is no nonwrapped value).

Just as we've seen above with the other natives, these constructor forms should generally be avoided, unless you really know you need them, mostly because they introduce exceptions and gotchas that you probably don't really *want* to deal with.

### `Array(..)`

```js
var a = new Array( 1, 2, 3 );
a; // [1, 2, 3]

var b = [1, 2, 3];
b; // [1, 2, 3]
```

**注意** new写不写都没关系。

`Array`这个构造函数有一个特殊的地方，当你只传入一个数字的时候，不代表你构造了那个数字的数组，你构造了一个预设容量的数组。

这就很糟糕了。你会不经意这样做，人都比较健忘嘛。

更重要的是，js里没有预设数组容量这回事，你其实只是创造了一个空数组，并且把这个数组的length属性设置为那个数字罢了。

An array that has no explicit values in its slots, but has a `length` property that *implies* the slots exist, is a weird exotic type of data structure in JS with some very strange and confusing behavior. The capability to create such a value comes purely from old, deprecated, historical functionalities ("array-like objects" like the `arguments` object).

**Note:** An array with at least one "empty slot" in it is often called a "sparse array."

It doesn't help matters that this is yet another example where browser developer consoles vary on how they represent such an object, which breeds more confusion.

For example:

```js
var a = new Array( 3 );

a.length; // 3
a;
```

The serialization of `a` in Chrome is (at the time of writing): `[ undefined x 3 ]`. **This is really unfortunate.** It implies that there are three `undefined` values in the slots of this array, when in fact the slots do not exist (so-called "empty slots" -- also a bad name!).

To visualize the difference, try this:

```js
var a = new Array( 3 );
var b = [ undefined, undefined, undefined ];
var c = [];
c.length = 3;

a;
b;
c;
```

**Note:** As you can see with `c` in this example, empty slots in an array can happen after creation of the array. Changing the `length` of an array to go beyond its number of actually-defined slot values, you implicitly introduce empty slots. In fact, you could even call `delete b[1]` in the above snippet, and it would introduce an empty slot into the middle of `b`.

For `b` (in Chrome, currently), you'll find `[ undefined, undefined, undefined ]` as the serialization, as opposed to `[ undefined x 3 ]` for `a` and `c`. Confused? Yeah, so is everyone else.

Worse than that, at the time of writing, Firefox reports `[ , , , ]` for `a` and `c`. Did you catch why that's so confusing? Look closely. Three commas implies four slots, not three slots like we'd expect.

**What!?** Firefox puts an extra `,` on the end of their serialization here because as of ES5, trailing commas in lists (array values, property lists, etc.) are allowed (and thus dropped and ignored). So if you were to type in a `[ , , , ]` value into your program or the console, you'd actually get the underlying value that's like `[ , , ]` (that is, an array with three empty slots). This choice, while confusing if reading the developer console, is defended as instead making copy-n-paste behavior accurate.

If you're shaking your head or rolling your eyes about now, you're not alone! Shrugs.

Unfortunately, it gets worse. More than just confusing console output, `a` and `b` from the above code snippet actually behave the same in some cases **but differently in others**:

```js
a.join( "-" ); // "--"
b.join( "-" ); // "--"

a.map(function(v,i){ return i; }); // [ undefined x 3 ]
b.map(function(v,i){ return i; }); // [ 0, 1, 2 ]
```

**Ugh.**

The `a.map(..)` call *fails* because the slots don't actually exist, so `map(..)` has nothing to iterate over. `join(..)` works differently. Basically, we can think of it implemented sort of like this:

```js
function fakeJoin(arr,connector) {
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		if (i > 0) {
			str += connector;
		}
		if (arr[i] !== undefined) {
			str += arr[i];
		}
	}
	return str;
}

var a = new Array( 3 );
fakeJoin( a, "-" ); // "--"
```

As you can see, `join(..)` works by just *assuming* the slots exist and looping up to the `length` value. Whatever `map(..)` does internally, it (apparently) doesn't make such an assumption, so the result from the strange "empty slots" array is unexpected and likely to cause failure.

So, if you wanted to *actually* create an array of actual `undefined` values (not just "empty slots"), how could you do it (besides manually)?

```js
var a = Array.apply( null, { length: 3 } );
a; // [ undefined, undefined, undefined ]
```

Confused? Yeah. Here's roughly how it works.

`apply(..)` is a utility available to all functions, which calls the function it's used with but in a special way.

The first argument is a `this` object binding (covered in the *this & Object Prototypes* title of this series), which we don't care about here, so we set it to `null`. The second argument is supposed to be an array (or something *like* an array -- aka an "array-like object"). The contents of this "array" are "spread" out as arguments to the function in question.

So, `Array.apply(..)` is calling the `Array(..)` function and spreading out the values (of the `{ length: 3 }` object value) as its arguments.

Inside of `apply(..)`, we can envision there's another `for` loop (kinda like `join(..)` from above) that goes from `0` up to, but not including, `length` (`3` in our case).

For each index, it retrieves that key from the object. So if the array-object parameter was named `arr` internally inside of the `apply(..)` function, the property access would effectively be `arr[0]`, `arr[1]`, and `arr[2]`. Of course, none of those properties exist on the `{ length: 3 }` object value, so all three of those property accesses would return the value `undefined`.

In other words, it ends up calling `Array(..)` basically like this: `Array(undefined,undefined,undefined)`, which is how we end up with an array filled with `undefined` values, and not just those (crazy) empty slots.

While `Array.apply( null, { length: 3 } )` is a strange and verbose way to create an array filled with `undefined` values, it's **vastly** better and more reliable than what you get with the footgun'ish `Array(3)` empty slots.

底线： **永远不要，在任何情况下都不要**创造empty-slot数组。

### `Object(..)`, `Function(..)`, and `RegExp(..)`

The `Object(..)`/`Function(..)`/`RegExp(..)` constructors are also generally optional (and thus should usually be avoided unless specifically called for):

```js
var c = new Object();
c.foo = "bar";
c; // { foo: "bar" }

var d = { foo: "bar" };
d; // { foo: "bar" }

var e = new Function( "a", "return a * 2;" );
var f = function(a) { return a * 2; };
function g(a) { return a * 2; }

var h = new RegExp( "^a*b+", "g" );
var i = /^a*b+/g;
```

There's practically no reason to ever use the `new Object()` constructor form, especially since it forces you to add properties one-by-one instead of many at once in the object literal form.

The `Function` constructor is helpful only in the rarest of cases, where you need to dynamically define a function's parameters and/or its function body. **Do not just treat `Function(..)` as an alternate form of `eval(..)`.** You will almost never need to dynamically define a function in this way.

Regular expressions defined in the literal form (`/^a*b+/g`) are strongly preferred, not just for ease of syntax but for performance reasons -- the JS engine precompiles and caches them before code execution. Unlike the other constructor forms we've seen so far, `RegExp(..)` has some reasonable utility: to dynamically define the pattern for a regular expression.

```js
var name = "Kyle";
var namePattern = new RegExp( "\\b(?:" + name + ")+\\b", "ig" );

var matches = someText.match( namePattern );
```

This kind of scenario legitimately occurs in JS programs from time to time, so you'd need to use the `new RegExp("pattern","flags")` form.

### `Date(..)` and `Error(..)`

The `Date(..)` and `Error(..)` native constructors are much more useful than the other natives, because there is no literal form for either.

To create a date object value, you must use `new Date()`. The `Date(..)` constructor accepts optional arguments to specify the date/time to use, but if omitted, the current date/time is assumed.

By far the most common reason you construct a date object is to get the current timestamp value (a signed integer number of milliseconds since Jan 1, 1970). You can do this by calling `getTime()` on a date object instance.

但一个更简单的方法是调用在es5的辅助函数，对于es5之前的可以这样：

```js
if (!Date.now) {
	Date.now = function(){
		return (new Date()).getTime();
	};
}
```

**注意：** 如果你不用new关键字而直接调用Date()，你会得到一个时间字符串。规范里面没有要求，但浏览器会遵循诸如： `"Fri Jul 18 2014 00:31:02 GMT-0500 (CDT)"`.

The `Error(..)` constructor (much like `Array()` above) behaves the same with the `new` keyword present or omitted.

The main reason you'd want to create an error object is that it captures the current execution stack context into the object (in most JS engines, revealed as a read-only `.stack` property once constructed). This stack context includes the function call-stack and the line-number where the error object was created, which makes debugging that error much easier.

You would typically use such an error object with the `throw` operator:

```js
function foo(x) {
	if (!x) {
		throw new Error( "x wasn't provided" );
	}
	// ..
}
```

Error object instances generally have at least a `message` property, and sometimes other properties (which you should treat as read-only), like `type`. However, other than inspecting the above-mentioned `stack` property, it's usually best to just call `toString()` on the error object (either explicitly, or implicitly through coercion -- see Chapter 4) to get a friendly-formatted error message.

**Tip:** Technically, in addition to the general `Error(..)` native, there are several other specific-error-type natives: `EvalError(..)`, `RangeError(..)`, `ReferenceError(..)`, `SyntaxError(..)`, `TypeError(..)`, and `URIError(..)`. But it's very rare to manually use these specific error natives. They are automatically used if your program actually suffers from a real exception (such as referencing an undeclared variable and getting a `ReferenceError` error).

### `Symbol(..)`

New as of ES6, an additional primitive value type has been added, called "Symbol". Symbols are special "unique" (not strictly guaranteed!) values that can be used as properties on objects with little fear of any collision. They're primarily designed for special built-in behaviors of ES6 constructs, but you can also define your own symbols.
在es6中，一个新的原始类型被加了进来，它就是"Symbol". "Symbol`是一个独一无二的值，可以被用在object的属性上面，而不用担心冲突。

Symbols can be used as property names, but you cannot see or access the actual value of a symbol from your program, nor from the developer console. If you evaluate a symbol in the developer console, what's shown looks like `Symbol(Symbol.create)`, for example.

There are several predefined symbols in ES6, accessed as static properties of the `Symbol` function object, like `Symbol.create`, `Symbol.iterator`, etc. To use them, do something like:

```js
obj[Symbol.iterator] = function(){ /*..*/ };
```

To define your own custom symbols, use the `Symbol(..)` native. The `Symbol(..)` native "constructor" is unique in that you're not allowed to use `new` with it, as doing so will throw an error.

```js
var mysym = Symbol( "my own symbol" );
mysym;				// Symbol(my own symbol)
mysym.toString();	// "Symbol(my own symbol)"
typeof mysym; 		// "symbol"

var a = { };
a[mysym] = "foobar";

Object.getOwnPropertySymbols( a );
// [ Symbol(my own symbol) ]
```

While symbols are not actually private (`Object.getOwnPropertySymbols(..)` reflects on the object and reveals the symbols quite publicly), using them for private or special properties is likely their primary use-case. For most developers, they may take the place of property names with `_` underscore prefixes, which are almost always by convention signals to say, "hey, this is a private/special/internal property, so leave it alone!"

**Note:** `Symbol`s are *not* `object`s, they are simple scalar primitives.

### Native Prototypes

每个内建原生构造器都有它自己的`.prototype` -- 比如`Array.prototype`,`String.prototype`,等等。

这些对象有自己独有的方法。

For example, all string objects, and by extension (via boxing) `string` primitives, have access to default behavior as methods defined on the `String.prototype` object.

**Note:** By documentation convention, `String.prototype.XYZ` is shortened to `String#XYZ`, and likewise for all the other `.prototype`s.

* `String#indexOf(..)`: find the position in the string of another substring
* `String#charAt(..)`: access the character at a position in the string
* `String#substr(..)`, `String#substring(..)`, and `String#slice(..)`: extract a portion of the string as a new string
* `String#toUpperCase()` and `String#toLowerCase()`: create a new string that's converted to either uppercase or lowercase
* `String#trim()`: create a new string that's stripped of any trailing or leading whitespace

None of the methods modify the string *in place*. Modifications (like case conversion or trimming) create a new value from the existing value.

By virtue of prototype delegation (see the *this & Object Prototypes* title in this series), any string value can access these methods:

```js
var a = " abc ";

a.indexOf( "c" ); // 3
a.toUpperCase(); // " ABC "
a.trim(); // "abc"
```

The other constructor prototypes contain behaviors appropriate to their types, such as `Number#toFixed(..)` (stringifying a number with a fixed number of decimal digits) and `Array#concat(..)` (merging arrays). All functions have access to `apply(..)`, `call(..)`, and `bind(..)` because `Function.prototype` defines them.

But, some of the native prototypes aren't *just* plain objects:

```js
typeof Function.prototype;			// "function"
Function.prototype();				// it's an empty function!

RegExp.prototype.toString();		// "/(?:)/" -- empty regex
"abc".match( RegExp.prototype );	// [""]
```

A particularly bad idea, you can even modify these native prototypes (not just adding properties as you're probably familiar with):

```js
Array.isArray( Array.prototype );	// true
Array.prototype.push( 1, 2, 3 );	// 3
Array.prototype;					// [1,2,3]

// don't leave it that way, though, or expect weirdness!
// reset the `Array.prototype` to empty
Array.prototype.length = 0;
```

As you can see, `Function.prototype` is a function, `RegExp.prototype` is a regular expression, and `Array.prototype` is an array. Interesting and cool, huh?

#### Prototypes As Defaults(原型作为初始值)

`Function.prototype` being an empty function, `RegExp.prototype` being an "empty" (e.g., non-matching) regex, and `Array.prototype` being an empty array, make them all nice "default" values to assign to variables if those variables wouldn't already have had a value of the proper type.

For example:

```js
function isThisCool(vals,fn,rx) {
	vals = vals || Array.prototype;
	fn = fn || Function.prototype;
	rx = rx || RegExp.prototype;

	return rx.test(
		vals.map( fn ).join( "" )
	);
}

isThisCool();		// true

isThisCool(
	["a","b","c"],
	function(v){ return v.toUpperCase(); },
	/D/
);					// false
```

**Note:** As of ES6, we don't need to use the `vals = vals || ..` default value syntax trick (see Chapter 4) anymore, because default values can be set for parameters via native syntax in the function declaration (see Chapter 5).

One minor side-benefit of this approach is that the `.prototype`s are already created and built-in, thus created *only once*. By contrast, using `[]`, `function(){}`, and `/(?:)/` values themselves for those defaults would (likely, depending on engine implementations) be recreating those values (and probably garbage-collecting them later) for *each call* of `isThisCool(..)`. That could be memory/CPU wasteful.

Also, be very careful not to use `Array.prototype` as a default value **that will subsequently be modified**. In this example, `vals` is used read-only, but if you were to instead make in-place changes to `vals`, you would actually be modifying `Array.prototype` itself, which would lead to the gotchas mentioned earlier!

**Note:** While we're pointing out these native prototypes and some usefulness, be cautious of relying on them and even more wary of modifying them in any way. See Appendix A "Native Prototypes" for more discussion.

## Review

JavaScript provides object wrappers around primitive values, known as natives (`String`, `Number`, `Boolean`, etc). These object wrappers give the values access to behaviors appropriate for each object subtype (`String#trim()` and `Array#concat(..)`).

If you have a simple scalar primitive value like `"abc"` and you access its `length` property or some `String.prototype` method, JS automatically "boxes" the value (wraps it in its respective object wrapper) so that the property/method accesses can be fulfilled.