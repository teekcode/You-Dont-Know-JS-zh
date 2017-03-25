```js
var a = function() {} //函数对象
console.log(a.prototype); //原型对象
var obj = new a; //实例对象
a.prototype.foo = function() {}
```
//obj就会多一个新的方法,可以看到很方便的扩展了`实例对象`的方法

>https://zhidao.baidu.com/question/1640179739516364580.html

leve 0 函数就是相当于类，函数又可以叫做构造函数。
       把对象叫做实例对象，是为了说明，这个对象是用函数new出来的。

level 1 实例对象是对象，函数(Function)是对象，函数原型(Function.prototype)是对象。
注：这里函数原型是一个实实在在的东西，而函数上的prototype属性是一个指针，指向函数原型。

level 2 实例对象具有属性__proto__, 指向`函数原型`(这样也是why实例对象can访问`函数原型`里面定义的对象(即属性和方法)了)
注：因为函数也是对象，所以函数也有__proto__,指向函数的构造函数的原型(Function.prototype)
    原型对象也是对象，所以指向构造对象的原型(Object.prototype),最后Object.prototype的__proto__指向null

level 3 函数的一个属性prototype指向原型对象，原型对象上有一个属性constructor指向函数。
注：这里讲的是函数和原型对象的关系。

level 4 总结：对象有__proto__,方法有__proto__还有prototype

teekcode修订于17.3.24

>http://zhihu.com/question/34183746/answer/58155878

# JavaScript使用函数模拟类，并基于原型对象实现继承。

## ES5继承

this.cp6 line 239
改编
```js
function Father(age) {
  this.sex = 'male';
  this.age = age
}
Father.prototype.showage = function() {
	return "I am " + this.age + "years old";
};

function Son(age) {
	Father.call( this, age );
}
Son.prototype = Object.create( Father.prototype );

Son.prototype.talkmore = function() {
  console.log(this.showage(), "and i am young");
};

var s = new Son(18);
s.showage();
s.talkmore();

var f = new Father(40);
f.showage();
f.talkmore();//not a function
```

https://itbilu.com/javascript/js/EkR85KsBW.html

```js
function Person(name, sex) {
  this.name = name;
  Object.defineProperty(this, 'sex', {
    get: function() { return sex; }
  });
}

Person.prototype.sayName = function() {
  return this.name;
}

function Student(name, sex) {
	Person.call(this, name, sex);
}	

Student.prototype = Object.create(Person.prototype);

//doing more things than previous example
Student.prototype.constructor = Student;

var student = new Student('王二小', '女');
console.log(student.sayName());  // 王二小
```

## 用es6的class改写

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ',' + this.y +')';
    }
}

//没有逗号，类里面的构造函数相当于以前的构造函数

Object.assign方法可以方便的添加方法

class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});

//另外，类内部定义的方法,如constructor，不可枚举