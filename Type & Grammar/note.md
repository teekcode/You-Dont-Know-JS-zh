here i list some of the frequent f&q in Type & Grammar section, and show the best practise as far as I know.

##F1: arguments(array-like) to array 

###A1:
>cp2: line 87

一种常用的转换方法是，借用slice(...)函数：

    var arr = Array.prototype.slice.call( arguments );

在es6中,Array.from(..)可以做相同的事情：

...
var arr = Array.from( arguments );
...

##F2: array copy
###A2
>cp2: line 690

foo( a.slice() );