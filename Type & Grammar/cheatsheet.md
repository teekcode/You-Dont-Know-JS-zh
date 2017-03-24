>Here is a cheatsheet in Type & Grammar section.

# F1: arguments(array-like) to array 

pre-es6:

function show_array_arguments() {
    return [].slice.call(arguments);
}

var passed_arguments_in_array_form = show_array_artuments(1, 2, 3)


es6:

    var arr = Array.from( arguments );

>cp2: line 87

ext: call和apply是为了动态改变this而出现的，当一个对象没有某个方法，但是其他的有，我们可以借助call或apply用其它对象的方法来操作。

# F2: array operation

a.slice() ;//复制数组 

Def: The slice() method returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included). The original array will not be modified.

Usage: passing to function that will change a but you dont want a to be changed. 

Notice .slice() can also be used at string. 

>cp2: line 690
array.splice(); //cut the array

# F2.1: array functional operation

*array.some*

>related problem `StripUrlParams`

array.map();
array.forEach();
array.join();

# F3.1: string to array

var a = "hi"
a.split(""); //["h", "i"]

link: a.split("").join("")

var b = "hello world"
b.split(" "); //["hello", "world"]

>related problem: `StripUrlParams`, `DidYouMean`

advanced thinking:

trans string to array, such as string.match(using g flag) /string.replace(filter useless character to "")

# F4：object to array

var a = {key:"value"}
Object.keys(a) //["key"]

# F5 null




