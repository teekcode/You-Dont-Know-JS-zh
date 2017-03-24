# about callback promise & async-await
http://rossboucher.com/await

`Promises` are an object that represents a value which will **eventually be available**. It might already be available, or it might be ready in a little while.
You interact with promises by **passing a callback** to its `then` function. That's why they are sometimes called "thennables."

What does `async` do? Essentially, it wraps the return value of the function in a promise.
`await` takes a promise, waits for it's value to be available, and then returns that value.

# about async-await
https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6

see ./codewars/nodejs/sleep.js

# tool
>online babel https://babeljs.io/repl
