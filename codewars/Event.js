function isFunction(f){
	return typeof f == "function";
}

function Event() {
  var varfun = [];
  
  this.subscribe = function() {
    console.log("sub");
    Array.from(arguments).filter(isFunction).forEach(function(i){varfun.push(i)}) 
  }
  
  this.emit = function() {
    console.log("emit");
    var cache = varfun.slice();//??
    cache.forEach(v => v.apply(this, arguments));//??
  }
  
  this.unsubscribe = function() { 
    console.log("unsub");
    Array.from(arguments).filter(isFunction).forEach(function(i){
      var i = varfun.lastIndexOf(i);
      if(i > -1) {
        varfun.splice(i, 1);
      }
    })
  }
}

function l(arr) { arr.push('l'); }
function o(arr) { arr.push('o'); }
function q(arr) { arr.push('q'); e.subscribe(l, o);}

var e = new Event(),
    bucket = [];

e.subscribe(l, o, l);
e.emit(bucket);

//bucket should be ['l', 'o', 'l']
//Test.assertSimilar(bucket, ['l', 'o', 'l']); 

e.unsubscribe(o, l);
bucket = [];

e.emit(bucket); //bucket should be ['l']

//Test.assertSimilar(bucket, ['l']); 
bucker = [];
e.subscribe(q);
e.emit(bucker);
console.log(bucker);
bucker = [];
e.emit(bucker);
console.log(bucker);


/**
 * This excercise is a more sophisticated version of Simple Events kata.

Your task is to implement an Event constructor function for creating event objects

var event = new Event();

which comply to the following:

an event object should have .subscribe() and .unsubscribe() methods to add and remove handlers

.subscribe() and .unsubscribe() should be able take an arbitrary number of arguments and tolerate invalid arguments (not functions, or for unsubscribe, functions which are not subscribed) by simply skipping them

multiple subscription of the same handler is allowed, and in this case unsubscription removes the last subscription of the same handler

an event object should have an .emit() method which must invoke all the handlers with the arguments provided

.emit() should use its own invocation context as handers' invocation context

the order of handlers invocation must match the order of subscription

handler functions can subscribe and unsubscribe handlers, but the changes should only apply to the next emit call - the handlers for an ongoing emit call should not be affected

subscribe, unsubscribe and emit are the only public properties that are allowed on event objects (apart from Object.prototype methods)
 */