>Here is a cheatsheet in Type & Grammar section.

# F1: arguments(array-like) to array 

pre-es6:

    var arr = Array.prototype.slice.call( arguments );

es6:

    var arr = Array.from( arguments );

>cp2: line 87

# F2: array operation

foo( a.slice() ); //copy new array, foo will not affect original a;

>cp2: line 690
array.splice(); //cut the array

# F2.1: array functional operation

*array.some*

>related problem `StripUrlParams`

array.map();
array.forEach();
array.join();



# F3: string to array

var a = "hi"
a.split(""); //["h", "i"]

link: a.split("").join("")

var b = "hello world"
b.split(" "); //["hello", "world"]

>related problem: `StripUrlParams`, `DidYouMean`

# F4：object to array

var a = {key:"value"}
Object.keys(a) //["key"]

# F5 null




