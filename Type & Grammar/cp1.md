110caeb  on 17 Feb 2016
@mmurkidjanian mmurkidjanian update ch1.md in types & grammar

<!-- TOC -->

- [管他妈的类型](#管他妈的类型)
- [内建类型](#内建类型)
- [值有类型](#值有类型)
    - [undefined 和 "undeclared"](#undefined-和-undeclared)
    - [typeof Undeclared](#typeof-undeclared)
- [Review](#review)

<!-- /TOC -->

cp1 类型们

大多数开发者认为，一个类似于javascript的动态语言没有类型。我们看看ES5.1规范（http://www.ecma-international.org/ecma-262/5.1/）关于这点是怎么说的：

>好难懂

好了，如果你是一个强类型（静态类型）语言的粉，你或许会反对这个'类型'词的用法。在这些语言中，类型这个词的含义远比我们这里讨论的javascript的含义大。

有些人说js不应该声称有类型，他们应该被称作有标记或者subtypes.

我们这里将粗暴地定义了，类型是

具体的来说，如果引擎和开发者区别对待`42`这个数字和对待`"42"`这个字符串，那么这两个值有不同的类型，数字类型和字符串类型。当你使用42这个数字的时候，我们认为你在做一些算数。但当你在使用"42"的时候，我们认为你在做向一个页面输出。这样，这两个不同的值有不同类型。（作者在这里认为不同的用处对应不同的类型）

#管他妈的类型

我们暂且不讨论学术上的定义，javascript有没有类型随他。

对每个类型和他内在的表现对理解如何准确转换值的类型至关重要（见第四章的强制类型转换），几乎每个javascript程序员都要解决值的类型转换，所以对于他们，负责并有信心地做这个事情很重要。

比如，你有一个数字42，但是你想取出2这个数字，你就必须把这个数字处理成字符串。这个看起来还比较容易。
但是，还有很多情况。有些很显然，很容易做到。但是如果你不小心对待，强制转换会不如你所愿。

强制转换上的困惑，或许是javascript程序员最头大的了。它常常被指责很危险，并且被认为是设计语言上的瑕疵。

一旦有了对javascript类型上的理解，我们可以发现，强制类型转换的坏名声被过度炒作并且不应该有这坏名声，让你改变对他的看法。来让我们看到强制转换的强大和有用。但首先，我们得对值和类型有一个很好理解。

#内建类型

javascript有其中类型：

- null
- undefined
- boolean
- number
- string
- object
- symbol --在es6中新增

注意： 除了object，其他的都是原始类型。

typeof这个操作符显示值的类型，并且显示的值是七个类型之一的字符串，不要惊讶，他们并不是一一对应的。


    typeof undefined     === "undefined"; // true
    typeof true          === "boolean";   // true
    typeof 42            === "number";    // true
    typeof "42"          === "string";    // true
    typeof { life: 42 }  === "object";    // true

    // added in ES6!
    typeof Symbol()      === "symbol";    // true

上面这六个是一一对应的。symbol是一个es6中新的类型，会在cp3中讲到。

    typeof null          === "object"      //true

如果返回null，就再正确和nice不过了，但这个bug存在了24年多了，and will likely never be fixed because there's too much existing web content that relies on its buggy behavior that "fixing" the bug would create more "bugs" and break a lot of web software.

如果你想检查一个值的类型，你要用到符合条件：

    var a = null;
    (!a && typeof a === "object"); // true

null是唯一一个原始值，他有点假，但typeof检查后返回object.

那么，typeof返回的第七个字符串类型是什么呢？

    typeof function a() {/*..*/} === "function"; //true

我们很容易想到，函数是js一个顶层内建类型，特别是考虑到typeof的行为。但是，如果你阅读规范，发现它是object的一个subtype，一个函数被认为是一个可以被调用的object,一个函数是一个有[[Call]]类型的object，从而让他被允许调用。

一个函数是object的思想很有用，更重要的是，他们有属性，比如：

    function a(b, c) {
        /* .. */
    }

函数有个一个length属性，它的值是参数个数。

    a.length; // 2

那数组呢，我们也认为它是object的subtype.

    typeof [1, 2, 3] === "object"; // true

把数组认为是object的subtype也是正确的。在这个例子中，数组被数字索引（相对于object中被字符串索引），并且维护了一个自动更新的.length属性。

#值有类型

在js中，变量没有类型，值有类型。变量可以存任何值。

换种角度看js类型是js没有类型强制，就是说，引擎没有要求一个变量始终只能代表一个初始类型。一个变量，可以在一个赋值语句里面保存一个string类型的值，在下一句语句里面保存number。

42有一个内在的类型number，并且42的类型是不能变的。另一个值，"42"是字符串类型，以被由42强制转换得到。

如果你对一个变量使用typeof，你不是在问这个变量的类型，你是在问，这个变量里面的值是什么类型。

    var a = 42;
    typeof a; // "number"

    a = true;
    typeof a; // "boolean"

    typeof typeof 42; //"string"

第一个typeof 42返回 "number",第二个返回"string".


##undefined 和 "undeclared"

没有值的变量，使用typeof总会返回undefined。

    var a;

    typeof a; // "undefined"

    var b = 42;
    var c;

    // later
    b = c;

    typeof b; // "undefined"
    typeof c; // "undefined"

对于大多数开发者来说，看见undefined会想到undeclared,但是，在js中，这两个词天差地别。

    var a;

    a; // undefined
    b; // ReferenceError: b is not defined

一个惹人的混淆是浏览器给的错误信息，你可以发现，b is not define这句话，很容易改成b is undefinde 但这是不一样的。如果浏览器可以说，b is not found 或者 b is not declared就好了.

    var a;

    typeof a;
    typeof b;

typeof都返回了undefined， 即使是没有被定义的b。并且注意到，没有错误被甩出，当我们运行typeof b的时候，即使b没有被定义。这个是在typeof里面的特殊保护。

##typeof Undeclared

尽管这样，这个安全措施是一个有用的特性，特别是我们在浏览器运行js的时候，当多个脚本文件把变量放进全局共享空间的时候。

>注意：很多开发者认为不应该有任何变量在全局空间，并且每个变量都应该在模块中或者私有、各自的空间内。这个是很好的理论，但不容易付诸行动，在js仍然是一个奋斗的目标。有幸的是，es6增加了对模块的支持，最终会让这个理论很好地实践。

作为一个简单的例子，假设我们有一个控制了程序debug的全局变量。在想要运行一个打印日志到console的任务的时候，你想要知道那个变量是否申明了。但只有一个

    var = DEBUG = true

被声明在debug.js文件中，并且只有当你在开发和测试后的时候会载入浏览器，在生产环境中是没有的。

但是，你要处理好你怎么检查这个DEBUG变量，从而你不会拿到一个ReferenceError.

typeof的安全措施就发挥作用了。

    // oops, this would throw an error!
    if (DEBUG) {
        console.log( "Debugging is starting" );
    }

    // this is a safe existence check
    if (typeof DEBUG !== "undefined") {
        console.log( "Debugging is starting" );
    }

这种检查仍然会很有用，比如你在作一个内建api特性检查的时候，在检查的时候没有扔出一个错误很有用。

    if (typeof atob === "undefined") {
        atob = function() { /*..*/ };
    }

注意：不要在if里写var. tbc

另一个检查全局变量的方法是

    if (window.DEBUG) {
        // ..
    }

    if (!window.atob) {
        // ..
    }

不像引用没有声明的变量，当你想要获取一个不存在的对象的属性的时候（即使是window对象）也不会有`ReferenceError`.

另外，手动引用window全局变量使一些开发者喜欢避免的事，特别是你的代码需要运行在不同的js环境中的时候（不仅仅是浏览器，而且有可能是服务器端的node.js),这种情况下，全局变量不一定叫window.

技术上来说，这个typeof的安全措施是非常有用的，即使你不使用全局变量，尽管下面这些情况有可能很少见，并且有些开发者认为，这个设计模式不那么让人满意。设想一下，一个你想要其他人复制粘贴在他们程序或模块中的工具函数，在这个函数里，你想要知道他人函数中是否定义了那个变量（以便你利用而不自己写）：

    function doSomethingCool() {
        var helper =
            (typeof FeatureXYZ !== "undefined") ?
            FeatureXYZ :
            function() { /*.. default feature ..*/ };

        var val = helper();
        // ..
    }

`doSomethingCool`检测是否有一个变量叫做`FeatureXYZ`,如果有，就使用，否则就用函数内的。现在，如果某人在他们的模块或者程序里面用了这个函数，这个函数会安全地检查那些使用这个函数的人的代码里是否有`FeatureXYZ`:

    // an IIFE (see "Immediately Invoked Function Expressions"
    // discussion in the *Scope & Closures* title of this series)
    (function(){
        function FeatureXYZ() { /*.. my XYZ feature ..*/ }

        // include `doSomethingCool(..)`
        function doSomethingCool() {
            var helper =
                (typeof FeatureXYZ !== "undefined") ?
                FeatureXYZ :
                function() { /*.. default feature ..*/ };

            var val = helper();
            // ..
        }

        doSomethingCool();
    })();

在这里，`FeatureXYZ`不再是全局变量，但我们还是使用`typeof`的安全保证来安全检测。注意到没，这里我们不能使用全局变量，所以，`typeof`就很有用。

其他的开发者会采用一种叫做依赖注入的设计模式，不是通过`doSomethingCool`隐式检查`FeatureXYZ`是否在函数外面，他把依赖显式传入，比如：

    function doSomethingCool(FeatureXYZ) {
        var helper = FeatureXYZ ||
            function() { /*.. default feature ..*/ };

        var val = helper();
        // ..
    }

在设计这类函数的时候往往有很多选择，没有对错，都有利弊，但总的来说，`typeof`对于未声明的安全措施给了我们更多的选择。

#Review 

JavaScript has seven built-in types: null, undefined, boolean, number, string, object, symbol. They can be identified by the typeof operator.

Variables don't have types, but the values in them do. These types define intrinsic behavior of the values.

Many developers will assume "undefined" and "undeclared" are roughly the same thing, but in JavaScript, they're quite different. undefined is a value that a declared variable can hold. "Undeclared" means a variable has never been declared.

JavaScript unfortunately kind of conflates these two terms, not only in its error messages ("ReferenceError: a is not defined") but also in the return values of typeof, which is "undefined" for both cases.

However, the safety guard (preventing an error) on typeof when used against an undeclared variable can be helpful in certain cases.


