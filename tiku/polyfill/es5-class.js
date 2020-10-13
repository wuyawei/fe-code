// es6 的class，本质也是 寄生组合继承 的语法糖
// 主要的几个点

// 1. 包含两条继承链
// 构造函数的继承
// 构造函数的prototype的继承
// class Parent {
//    static classMethod() {
//        return 'hello';
//    }
// }

// class Child extends Parent {
// }
// console.log(Child.__proto__ === Parent); // true 普通的寄生组合继承没有这步，因为class的静态属性，子类也需要访问
// console.log(Child.prototype.__proto__ === Parent.prototype); // true 

// 2. 此外 super 关键字表示父类的构造函数，相当于 ES5 的 Parent.call(this)。子类必须要调用super后，才能使用this
// 3. class函数只能通过 new 调用，不能通过普通函数调用


// 先看一下寄生组合继承

function newObject(f, ...args) {
    // const o = {};
    // o.__proto__ = f.prototype;
    // Object.setPrototypeOf(o, f.prototype);
    const o = Object.create(f.prototype);
    const result = f.call(o, ...args);
    return typeof result === 'object' && result !== null ? result : o;
}

function createObject(o) {
    function f() {};
    f.prototype = o;
    return new f();
}

function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log(this.name);
}

function Child(name) {
    Parent.call(this, name);
}
Child.prototype = Object.create(Parent.prototype);
const lisi = new Child('lisi');
lisi.sayName();