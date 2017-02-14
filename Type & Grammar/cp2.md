65947b6  on 14 Apr 2016
@adius adius Fix typos

<!-- TOC -->

- [Array](#array)
    - [Array-Likes](#array-likes)
- [Strings](#strings)
- [Numbers](#numbers)
    - [数字语法](#数字语法)
    - [Small Decimal Values](#small-decimal-values)
    - [Safe Integer Ranges](#safe-integer-ranges)
    - [判别整数](#判别整数)
    - [32-bit (Signed) Integers](#32-bit-signed-integers)
- [Special Values](#special-values)
    - [不是值的值](#不是值的值)
    - [undefined](#undefined)
        - [void操作符](#void操作符)
    - [Special Numbers](#special-numbers)
        - [The Not Number](#the-not-number)
        - [Infinities](#infinities)
        - [Zero](#zero)
    - [Special equality](#special-equality)
- [Value vs. Reference](#value-vs-reference)
- [Review](#review)

<!-- /TOC -->


array们，string们，number们是大多数程序的基本组成部分，但javascript在这些类型上有一些特性，这些特性也许会让你赞叹，但有时也会让你困惑不解。

让我们来看看几个js内建的value type，以此完全理解并正确利用他们的价值。

#Array

跟其他强制类型语言不同，js的array只是任何类型的值的容器，比如，number,object, array(这意味着多维数组)

var a = [ 1, "2", [3] ];

a.length;       // 3
a[0] === 1;     // true
a[2][0] === 3;  // true

你不需要预先设置array的值，你可以先声明他们，然后按需放入值。

var a = [ ];

a.length;   // 0

a[0] = 1;
a[1] = "2";
a[2] = [ 3 ];

a.length;   // 3

tbc delete在array上的表现。

tbc 稀疏的array。

tbc array是数字索引的，但也可以用string作为键/属性，但这不会算进length里面

var a = [ ];

a[0] = 1;
a["foobar"] = 2;

a.length;       // 1
a["foobar"];    // 2
a.foobar;       // 2

但是如果一个string值是一个10进制的数的时候，这个string的效果相当于number

var a = [ ];

a["13"] = 42;

a.length; // 14

总之，array里面有string的键/属性不是一个好主意。用object的键/属性来存值，让array就用数字做索引吧。

##Array-Likes

有时候你有可能需要把一个像数组一样的值，转换成数组，这样，你就能使用数组的方法比如indexOf(), concat(), forEach()等等)来对待一群值。

比如，很多DOM查询操作返回一群DOM的列表，他们并不是array,但是是array-like的，足以让我们产生转换的冲动。另外一个例子是，函数会暴露arguments对象来获取参数（在es6中已经弃用）

一种常用的转换方法是，借用slice(...)函数：

function foo() {
    var arr = Array.prototype.slice.call( arguments );
    arr.push( "bam" );
    console.log( arr );
}

foo( "bar", "baz" ); // ["bar","baz","bam"]

在es6中,Array.from(..)可以做相同的事情：

...
var arr = Array.from( arguments );
...

tbc ES6 & Beyond

#Strings

string看起来只是一个个字母组成的数组。但实际上，string的实现，或许并不是用的数组，意识到javascript的string不是一个个字母组成的数组这件事很重要。他们看上去相同，只是表面看上去而已。

比如：

var a = "foo";
var b = ["f","o","o"];

string确实和array有着很浅的相同，比如他们都有一个length的属性，一个indexOf的方法（仅仅是es5的），和一个concat方法。

a.length;                           // 3
b.length;                           // 3

a.indexOf( "o" );                   // 1
b.indexOf( "o" );                   // 1

var c = a.concat( "bar" );          // "foobar"
var d = b.concat( ["b","a","r"] );  // ["f","o","o","b","a","r"]

a === c;                            // false
b === d;                            // false

a;                                  // "foo"
b;                                  // ["f","o","o"]


所以，他们只是一个个字母组成的array吗？不完全是。

a[1] = "O";
b[1] = "O";

a; // "foo"
b; // ["f","O","o"]

javascript的string是不可以修改的，但array是可以的。还有，a[1]不是广泛可行的，旧的IE就不可以（现在可以了）。正确的做法是a.charAt(1).

这个不可修改的string的特性导致，没有一个方法可以修改string里面的内容，只能新建另外的string,然后返回新的string。相反，array就可以在原来的array中修改值。

c = a.toUpperCase();
a === c;    // false
a;          // "foo"
c;          // "FOO"

b.push( "!" );
b;          // ["f","O","o","!"]

另外，尽管很多有用的方法string没有，但我们可以借用不修改原值的array方法。

a.join;         // undefined
a.map;          // undefined

var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
    return v.toUpperCase() + ".";
} ).join( "" );

c;              // "f-o-o"
d;              // "F.O.O."

让我们再举个栗子：反转string（面试中常见的问题）。array有reverse()方法，但string没有。

a.reverse;      // undefined

b.reverse();    // ["!","o","O","f"]
b;              // ["!","o","O","f"]

但不幸的是，string不能借用array原地修改值的方法，因为string是不可以修改原值的。

Array.prototype.reverse.call( a );
// still returns a String object wrapper (see Chapter 3)
// for "foo" :(

所以，我们黑一下，先把string转换成array,然后，反转，然后再转换成string.

var c = a
    // split `a` into an array of characters
    .split( "" )
    // reverse the array of characters
    .reverse()
    // join the array of characters back to a string
    .join( "" );

c; // "oof"

有没有觉得代码很丑，确实，但没关系，有用就好。如果你想要又快又省力地解决问题，这就够了。

警告：这样做有问题，对于复杂的字符（unicode）tbc.

所以我们从中可以感悟到，如果你经常做string的事情，你或许应该存的时候就用数组。这样能省力不少。你随时可以用join("")，当你需要string的时候。

#Numbers
javascript只有一个数字类型：number，这个类型包括整数和小数。但js中的整数不是真正的整数。（js有可能有个假整数）。

So, in JS, an "integer" is just a value that has no fractional decimal value. That is, 42.0 is as much an "integer" as 42.

Like most modern languages, including practically all scripting languages, the implementation of JavaScript's numbers is based on the "IEEE 754" standard, often called "floating-point." JavaScript specifically uses the "double precision" format (aka "64-bit binary") of the standard.

There are many great write-ups on the Web about the nitty-gritty details of how binary floating-point numbers are stored in memory, and the implications of those choices. Because understanding bit patterns in memory is not strictly necessary to understand how to correctly use numbers in JS, we'll leave it as an exercise for the interested reader if you'd like to dig further into IEEE 754 details.

##数字语法

js里面用10进制表示数字。比如:

var a = 42;
var b = 42.3;

如果整数部分是0，那么可以省略

var a = 0.42;
var b = .42;

反之亦然：

var a = 42.0;
var b = 42.;

警告：42.这样写虽然合法，但不建议，特别是他人遇到这样的代码会疑惑。

输出会去除多余的零，所以：

var a = 42.300;
var b = 42.0;

a; // 42.3
b; // 42

非常大或者非常小的数字，会以指数的形式输出：

var a = 5E10;
a;                  // 50000000000
a.toExponential();  // "5e+10"

var b = a * a;
b;                  // 2.5e+21

var c = 1 / a;
c;                  // 2e-11

因为number数字可以被Number对象包裹，所以，就会有了可以使用的方法。

var a = 42.59;

a.toFixed( 0 ); // "43"
a.toFixed( 1 ); // "42.6"
a.toFixed( 2 ); // "42.59"
a.toFixed( 3 ); // "42.590"
a.toFixed( 4 ); // "42.5900"

注意，输出是string的表达式，并且小数部分精确度不够的用0补充了

toPrecision(..) is similar, but specifies how many significant digits should be used to represent the value:

var a = 42.59;

a.toPrecision( 1 ); // "4e+1"
a.toPrecision( 2 ); // "43"
a.toPrecision( 3 ); // "42.6"
a.toPrecision( 4 ); // "42.59"
a.toPrecision( 5 ); // "42.590"
a.toPrecision( 6 ); // "42.5900"

其实你不需要用一个变量来存一个值，然后再使用.来访问方法。你可以直接用数字。但要格外小心。

// invalid syntax:
42.toFixed( 3 );    // SyntaxError

// these are all valid:
(42).toFixed( 3 );  // "42.000"
0.42.toFixed( 3 );  // "0.420"
42..toFixed( 3 );   // "42.000"

42.toFixed(3) is invalid syntax, because the . is swallowed up as part of the 42. literal (which is valid -- see above!), and so then there's no . property operator present to make the .toFixed access.

42..toFixed(3) works because the first . is part of the number and the second . is the property operator. But it probably looks strange, and indeed it's very rare to see something like that in actual JavaScript code. In fact, it's pretty uncommon to access methods directly on any of the primitive values. Uncommon doesn't mean bad or wrong.

Note: There are libraries that extend the built-in Number.prototype (see Chapter 3) to provide extra operations on/with numbers, and so in those cases, it's perfectly valid to use something like 10..makeItRain() to set off a 10-second money raining animation, or something else silly like that.

This is also technically valid (notice the space):

42 .toFixed(3); // "42.000"

这样做没什么好处。

number还可以被指定为指数形式，在表示大数的时候很常见，比如：

var onethousand = 1E3;                      // means 1 * 10^3
var onemilliononehundredthousand = 1.1E6;   // means 1.1 * 10^6

number还可以被表示为其他进制，比如二进制，八进制，和十六进制。

这些形式在现在的js中可行。

0xf3; // hexadecimal for: 243
0Xf3; // 同上ditto

0363; // octal for: 243

Note: Starting with ES6 + strict mode, the 0363 form of octal literals is no longer allowed (see below for the new form). The 0363 form is still allowed in non-strict mode, but you should stop using it anyway, to be future-friendly (and because you should be using strict mode by now!).

在es6中，下面这些新的形势是合乎标准的：

0o363;      // octal for: 243
0O363;      // ditto

0b11110011; // binary for: 243
0B11110011; // ditto

Please do your fellow developers a favor: never use the 0O363 form. 0 next to capital O is just asking for confusion. Always use the lowercase predicates 0x, 0b, and 0o.

##Small Decimal Values

The most (in)famous side effect of using binary floating-point numbers (which, remember, is true of all languages that use IEEE 754 -- not just JavaScript as many assume/pretend) is:

0.1 + 0.2 === 0.3; // false
Mathematically, we know that statement should be true. Why is it false?

Simply put, the representations for 0.1 and 0.2 in binary floating-point are not exact, so when they are added, the result is not exactly 0.3. It's really close: 0.30000000000000004, but if your comparison fails, "close" is irrelevant.

Note: Should JavaScript switch to a different number implementation that has exact representations for all values? Some think so. There have been many alternatives presented over the years. None of them have been accepted yet, and perhaps never will. As easy as it may seem to just wave a hand and say, "fix that bug already!", it's not nearly that easy. If it were, it most definitely would have been changed a long time ago.

Now, the question is, if some numbers can't be trusted to be exact, does that mean we can't use numbers at all? Of course not.

There are some applications where you need to be more careful, especially when dealing with fractional decimal values. There are also plenty of (maybe most?) applications that only deal with whole numbers ("integers"), and moreover, only deal with numbers in the millions or trillions at maximum. These applications have been, and always will be, perfectly safe to use numeric operations in JS.

What if we did need to compare two numbers, like 0.1 + 0.2 to 0.3, knowing that the simple equality test fails?

The most commonly accepted practice is to use a tiny "rounding error" value as the tolerance for comparison. This tiny value is often called "machine epsilon," which is commonly 2^-52 (2.220446049250313e-16) for the kind of numbers in JavaScript.

As of ES6, Number.EPSILON is predefined with this tolerance value, so you'd want to use it, but you can safely polyfill the definition for pre-ES6:

if (!Number.EPSILON) {
    Number.EPSILON = Math.pow(2,-52);
}
We can use this Number.EPSILON to compare two numbers for "equality" (within the rounding error tolerance):

function numbersCloseEnoughToEqual(n1,n2) {
    return Math.abs( n1 - n2 ) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual( a, b );                  // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );  // false
The maximum floating-point value that can be represented is roughly 1.798e+308 (which is really, really, really huge!), predefined for you as Number.MAX_VALUE. On the small end, Number.MIN_VALUE is roughly 5e-324, which isn't negative but is really close to zero!

##Safe Integer Ranges

Because of how numbers are represented, there is a range of "safe" values for the whole number "integers", and it's significantly less than Number.MAX_VALUE.

The maximum integer that can "safely" be represented (that is, there's a guarantee that the requested value is actually representable unambiguously) is 2^53 - 1, which is 9007199254740991. If you insert your commas, you'll see that this is just over 9 quadrillion. So that's pretty darn big for numbers to range up to.

This value is actually automatically predefined in ES6, as Number.MAX_SAFE_INTEGER. Unsurprisingly, there's a minimum value, -9007199254740991, and it's defined in ES6 as Number.MIN_SAFE_INTEGER.

The main way that JS programs are confronted with dealing with such large numbers is when dealing with 64-bit IDs from databases, etc. 64-bit numbers cannot be represented accurately with the number type, so must be stored in (and transmitted to/from) JavaScript using string representation.

Numeric operations on such large ID number values (besides comparison, which will be fine with strings) aren't all that common, thankfully. But if you do need to perform math on these very large values, for now you'll need to use a big number utility. Big numbers may get official support in a future version of JavaScript.

##判别整数

To test if a value is an integer, you can use the ES6-specified Number.isInteger(..):

Number.isInteger( 42 );     // true
Number.isInteger( 42.000 ); // true
Number.isInteger( 42.3 );   // false


To polyfill Number.isInteger(..) for pre-ES6:

if (!Number.isInteger) {
    Number.isInteger = function(num) {
        return typeof num == "number" && num % 1 == 0;
    };
}


To test if a value is a safe integer, use the ES6-specified Number.isSafeInteger(..):

Number.isSafeInteger( Number.MAX_SAFE_INTEGER );    // true
Number.isSafeInteger( Math.pow( 2, 53 ) );          // false
Number.isSafeInteger( Math.pow( 2, 53 ) - 1 );      // true


To polyfill Number.isSafeInteger(..) in pre-ES6 browsers:

if (!Number.isSafeInteger) {
    Number.isSafeInteger = function(num) {
        return Number.isInteger( num ) &&
            Math.abs( num ) <= Number.MAX_SAFE_INTEGER;
    };
}

##32-bit (Signed) Integers

While integers can range up to roughly 9 quadrillion safely (53 bits), there are some numeric operations (like the bitwise operators) that are only defined for 32-bit numbers, so the "safe range" for numbers used in that way must be much smaller.

The range then is Math.pow(-2,31) (-2147483648, about -2.1 billion) up to Math.pow(2,31)-1 (2147483647, about +2.1 billion).

To force a number value in a to a 32-bit signed integer value, use a | 0. This works because the | bitwise operator only works for 32-bit integer values (meaning it can only pay attention to 32 bits and any other bits will be lost). Then, "or'ing" with zero is essentially a no-op bitwise speaking.

Note: Certain special values (which we will cover in the next section) such as NaN and Infinity are not "32-bit safe," in that those values when passed to a bitwise operator will pass through the abstract operation ToInt32 (see Chapter 4) and become simply the +0 value for the purpose of that bitwise operation.

#Special Values

有几个不同类型的特殊值开发者需要注意，并且正确使用。

##不是值的值

对于undefined这个类型，只有一个值，undefined. null这个类型也是。

Both undefined and null are often taken to be interchangeable as either "empty" values or "non" values. Other developers prefer to distinguish between them with nuance. For example:

null is an empty value
undefined is a missing value

Or:

undefined hasn't had a value yet
null had a value and doesn't anymore

Regardless of how you choose to "define" and use these two values, null is a special keyword, not an identifier, and thus you cannot treat it as a variable to assign to (why would you!?). However, undefined is (unfortunately) an identifier. Uh oh.

##undefined

在非严格模式下，可以把一个值附给undefined.

function foo() {
    undefined = 2;
}

foo();

function foo() {
    "use strict";
    undefined = 2; // TypeError!
}

foo();

In both non-strict mode and strict mode, however, you can create a local variable of the name undefined. But again, this is a terrible idea!

function foo() {
    "use strict";
    var undefined = 2;
    console.log( undefined ); // 2
}

foo();

Friends don't let friends override undefined. Ever.


###void操作符

当undefined关键字存储了undefined,我们还可以通过void操作符得到undefined.

表达式 void __ 去除了任何值，所以这个表达式的值一直是undefined,它不修改现有的值，只是保证没有值返回出来。

var a = 42;

console.log( void a, a ); // undefined 42

By convention (mostly from C-language programming), to represent the undefined value stand-alone by using void, you'd use void 0 (though clearly even void true or any other void expression does the same thing). There's no practical difference between void 0, void 1, and undefined.

但void这个操作符在某些情况下会很有用，如果你需要保证一个表达式没有结果值。

比如：

tbc

##Special Numbers

number类型有几个特殊的值，我们要来看一下

###The Not Number

Any mathematic operation you perform without both operands being numbers (or values that can be interpreted as regular numbers in base 10 or base 16) will result in the operation failing to produce a valid number, in which case you will get the NaN value.

NaN literally stands for "not a number", though this label/description is very poor and misleading, as we'll see shortly. It would be much more accurate to think of NaN as being "invalid number," "failed number," or even "bad number," than to think of it as "not a number."

For example:

var a = 2 / "foo";      // NaN

typeof a === "number";  // true
In other words: "the type of not-a-number is 'number'!" Hooray for confusing names and semantics.

NaN is a kind of "sentinel value" (an otherwise normal value that's assigned a special meaning) that represents a special kind of error condition within the number set. The error condition is, in essence: "I tried to perform a mathematic operation but failed, so here's the failed number result instead."

So, if you have a value in some variable and want to test to see if it's this special failed-number NaN, you might think you could directly compare to NaN itself, as you can with any other value, like null or undefined. Nope.

var a = 2 / "foo";

a == NaN;   // false
a === NaN;  // false

NaN is a very special value in that it's never equal to another NaN value (i.e., it's never equal to itself). It's the only value, in fact, that is not reflexive (without the Identity characteristic x === x). So, NaN !== NaN. A bit strange, huh?

So how do we test for it, if we can't compare to NaN (since that comparison would always fail)?

var a = 2 / "foo";

isNaN( a ); // true

Easy enough, right? We use the built-in global utility called isNaN(..) and it tells us if the value is NaN or not. Problem solved!

没那么快（方便）。

isNaN有一个致命错误。它表现的太字面意思了。他的工作是检查传入的值是否是一个数字。

var a = 2 / "foo";
var b = "foo";

a; // NaN
b; // "foo"

window.isNaN( a ); // true
window.isNaN( b ); // true -- ouch!

Clearly, "foo" is literally not a number, but it's definitely not the NaN value either! This bug has been in JS since the very beginning (over 19 years of ouch).

As of ES6, finally a replacement utility has been provided: Number.isNaN(..). A simple polyfill for it so that you can safely check NaN values now even in pre-ES6 browsers is:

if (!Number.isNaN) {
    Number.isNaN = function(n) {
        return (
            typeof n === "number" &&
            window.isNaN( n )
        );
    };
}

var a = 2 / "foo";
var b = "foo";

Number.isNaN( a ); // true
Number.isNaN( b ); // false -- phew!

Actually, we can implement a Number.isNaN(..) polyfill even easier, by taking advantage of that peculiar fact that NaN isn't equal to itself. NaN is the only value in the whole language where that's true; every other value is always equal to itself.

So:

if (!Number.isNaN) {
    Number.isNaN = function(n) {
        return n !== n;
    };
}

很奇怪对吧，但这个有用。

NaNs are probably a reality in a lot of real-world JS programs, either on purpose or by accident. It's a really good idea to use a reliable test, like Number.isNaN(..) as provided (or polyfilled), to recognize them properly.

If you're currently using just isNaN(..) in a program, the sad reality is your program has a bug, even if you haven't been bitten by it yet!

###Infinities

从事传统需要编译语言的开发者或许常常见到编译器错误或者运行时异常，像被0除这种情况：

var a = 1 / 0;

但是，在js中，这种操作被很好地定义了，并且结果是Infinity()

var a = 1 / 0;  // Infinity
var b = -1 / 0; // -Infinity

As you can see, -Infinity (aka Number.NEGATIVE_INFINITY) results from a divide-by-zero where either (but not both!) of the divide operands is negative.

JS uses finite numeric representations (IEEE 754 floating-point, which we covered earlier), so contrary to pure mathematics, it seems it is possible to overflow even with an operation like addition or subtraction, in which case you'd get Infinity or -Infinity.

For example:

var a = Number.MAX_VALUE;   // 1.7976931348623157e+308
a + a;                      // Infinity
a + Math.pow( 2, 970 );     // Infinity
a + Math.pow( 2, 969 );     // 1.7976931348623157e+308

According to the specification, if an operation like addition results in a value that's too big to represent, the IEEE 754 "round-to-nearest" mode specifies what the result should be. So, in a crude sense, Number.MAX_VALUE + Math.pow( 2, 969 ) is closer to Number.MAX_VALUE than to Infinity, so it "rounds down," whereas Number.MAX_VALUE + Math.pow( 2, 970 ) is closer to Infinity so it "rounds up".

If you think too much about that, it's going to make your head hurt. So don't. Seriously, stop!

Once you overflow to either one of the infinities, however, there's no going back. In other words, in an almost poetic sense, you can go from finite to infinite but not from infinite back to finite.

It's almost philosophical to ask: "What is infinity divided by infinity". Our naive brains would likely say "1" or maybe "infinity." Turns out neither is true. Both mathematically and in JavaScript, Infinity / Infinity is not a defined operation. In JS, this results in NaN.

But what about any positive finite number divided by Infinity? That's easy! 0. And what about a negative finite number divided by Infinity? Keep reading!

###Zero

tbc  -0

##Special equality

tbc

#Value vs. Reference

在其他语言中，值可以被值拷贝或者引用拷贝，取决于你使用的句法。

比如，在c++中，你想要传一个变量给一个函数，并且要在函数内改变那个变量的值，你要在函数参数上声明Type & MyVar, 当你传一个x的时候，MyVar就是x的一个引用；引用像是特殊形式的指针，你取一个指针给一个变量（就如同你给指针取了个别名）。如果你不申明引用参数，传入的值只会被拷贝值，即使是一个复杂的对象。

在js中，有指针，并且引用也表现地和c++等语言不一样。You cannot have a reference from one JS variable to another variable. 

A reference in JS points at a (shared) value, so if you have 10 different references, they are all always distinct references to a single shared value; none of them are references/pointers to each other.

还有，在js中，没有语法上指定值还是引用拷贝。值的类型单独决定了采用何种方式。

让我们来看下：

var a = 2;
var b = a; // `b` is always a copy of the value in `a`
b++;
a; // 2
b; // 3

var c = [1,2,3];
var d = c; // `d` is a reference to the shared `[1,2,3]` value
d.push( 4 );
c; // [1,2,3,4]
d; // [1,2,3,4]

Simple values (aka scalar primitives) are always assigned/passed by value-copy: null, undefined, string, number, boolean, and ES6's symbol.

Compound values -- objects (including arrays, and all boxed object wrappers -- see Chapter 3) and functions -- always create a copy of the reference on assignment or passing.

But both c and d are separate references to the same shared value [1,2,3], which is a compound value. It's important to note that neither c nor d more "owns" the [1,2,3] value -- both are just equal peer references to the value. So, when using either reference to modify (.push(4)) the actual shared array value itself, it's affecting just the one shared value, and both references will reference the newly modified value [1,2,3,4].

因为引用指向值本身而不是变量，你不能使用一个引用去改变另一个引用的指向。

var a = [1,2,3];
var b = a;
a; // [1,2,3]
b; // [1,2,3]

// later
b = [4,5,6];
a; // [1,2,3]
b; // [4,5,6]

When we make the assignment b = [4,5,6], we are doing absolutely nothing to affect where a is still referencing ([1,2,3]). To do that, b would have to be a pointer to a rather than a reference to the array -- but no such capability exists in JS!

The most common way such confusion happens is with function parameters:

    function foo(x) {
        x.push( 4 );
        x; // [1,2,3,4]

        // later
        x = [4,5,6];
        x.push( 7 );
        x; // [4,5,6,7]
    }

    var a = [1,2,3];

    foo( a );

    a; // [1,2,3,4]  not  [4,5,6,7]

When we pass in the argument a, it assigns a copy of the a reference to x. x and a are separate references pointing at the same [1,2,3] value. Now, inside the function, we can use that reference to mutate the value itself (push(4)). But when we make the assignment x = [4,5,6], this is in no way affecting where the initial reference a is pointing -- still points at the (now modified) [1,2,3,4] value.

为了让a可以变成[4, 5, 6, 7]这个值，你不能新建一个值，你必须修改现有的array.

    function foo(x) {
        x.push( 4 );
        x; // [1,2,3,4]

        // later
        x.length = 0; // empty existing array in-place
        x.push( 4, 5, 6, 7 );
        x; // [4,5,6,7]
    }

    var a = [1,2,3];

    foo( a );

    a; // [4,5,6,7]  not  [1,2,3,4]

As you can see, x.length = 0 and x.push(4,5,6,7) were not creating a new array, but modifying the existing shared array. So of course, a references the new [4,5,6,7] contents.

再次强调，你不能控制值拷贝还是引用拷贝，完全是由值的类型决定的。

使用值拷贝传入一个复合值，你需要手动拷贝，以此那个传入的引用不会指向原来的值，比如：

foo( a.slice() );

slice(..) 没有传任何参数默认拷贝了一份array的值，所以我们只是传了一份拷贝array的值的引用，所以foo(..)不能影响到a.

另外，想要一个primitive value能够变化（像引用一样），你需要把值放在复合值里面(object, array, etc),这些可以传引用。

    function foo(wrapper) {
        wrapper.a = 42;
    }

    var obj = {
        a: 2
    };

    foo( obj );

    obj.a; // 42

在这里`obj`是基础属性`a`的一个包装。当`obj`被传到foo(..)里面的时候，一份`obj`的引用被传入，并且被设置为wrapper参数，我们现在可是使用wrapper引用来获得object,然后更新属性。在这个函数结束的时候，`obj.a`的值已经更改成42了。

It may occur to you that if you wanted to pass in a reference to a scalar primitive value like 2, you could just box the value in its Number object wrapper (see Chapter 3).

It is true a copy of the reference to this Number object will be passed to the function, but unfortunately, having a reference to the shared object is not going to give you the ability to modify the shared primitive value, like you may expect:

    function foo(x) {
        x = x + 1;
        x; // 3
    }

    var a = 2;
    var b = new Number( a ); // or equivalently `Object(a)`

    foo( b );
    console.log( b ); // 2, not 3

The problem is that the underlying scalar primitive value is not mutable (same goes for String and Boolean). If a Number object holds the scalar primitive value 2, that exact Number object can never be changed to hold another value; you can only create a whole new Number object with a different value.

When x is used in the expression x + 1, the underlying scalar primitive value 2 is unboxed (extracted) from the Number object automatically, so the line x = x + 1 very subtly changes x from being a shared reference to the Number object, to just holding the scalar primitive value 3 as a result of the addition operation 2 + 1. Therefore, b on the outside still references the original unmodified/immutable Number object holding the value 2.

You can add properties on top of the Number object (just not change its inner primitive value), so you could exchange information indirectly via those additional properties.

This is not all that common, however; it probably would not be considered a good practice by most developers.

Instead of using the wrapper object Number in this way, it's probably much better to use the manual object wrapper (obj) approach in the earlier snippet. That's not to say that there's no clever uses for the boxed object wrappers like Number -- just that you should probably prefer the scalar primitive value form in most cases.

References are quite powerful, but sometimes they get in your way, and sometimes you need them where they don't exist. The only control you have over reference vs. value-copy behavior is the type of the value itself, so you must indirectly influence the assignment/passing behavior by which value types you choose to use.

#Review

In JavaScript, arrays are simply numerically indexed collections of any value-type. strings are somewhat "array-like", but they have distinct behaviors and care must be taken if you want to treat them as arrays. Numbers in JavaScript include both "integers" and floating-point values.

Several special values are defined within the primitive types.

The null type has just one value: null, and likewise the undefined type has just the undefined value. undefined is basically the default value in any variable or property if no other value is present. The void operator lets you create the undefined value from any other value.

numbers include several special values, like NaN (supposedly "Not a Number", but really more appropriately "invalid number"); +Infinity and -Infinity; and -0.

Simple scalar primitives (strings, numbers, etc.) are assigned/passed by value-copy, but compound values (objects, etc.) are assigned/passed by reference-copy. References are not like references/pointers in other languages -- they're never pointed at other variables/references, only at the underlying values.
