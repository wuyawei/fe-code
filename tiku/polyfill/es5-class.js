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

// function newObject(f, ...args) {
//     // const o = {};
//     // o.__proto__ = f.prototype;
//     // Object.setPrototypeOf(o, f.prototype);
//     const o = Object.create(f.prototype);
//     const result = f.call(o, ...args);
//     return typeof result === 'object' && result !== null ? result : o;
// }

// function createObject(o) {
//     function f() {};
//     f.prototype = o;
//     return new f();
// }

// function Parent(name) {
//     this.name = name;
// }
// Parent.prototype.sayName = function() {
//     console.log(this.name);
// }

// function Child(name) {
//     Parent.call(this, name);
// }
// Child.prototype = Object.create(Parent.prototype);
// const lisi = new Child('lisi');
// lisi.sayName();


// class 
// class Parent {
//     constructor(name) {
//         this.name = name;
//     }
//     say() {
//         console.log(`我叫${this.name}, 今年 ${this.age}`)
//     }
// }
// class Child extends Parent {
//     constructor(name, age) {
//         super(name);
//         this.age = age;
//     }
// }

// const lisi = new Child('lisi', 18);
// lisi.say();

// es5

// 判断只能通过new调用
function _classCallCheck(instance, constructor) {
    if (!(instance instanceof constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// 继承
function _inherits(subclass, superclass) {
    // 父类必须是函数或者null，允许 class a extends null
    if (typeof superclass !== "function" && superclass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superclass);
    }

    // 原型继承，且改写对应的构造函数
    subclass.prototype = Object.create(superclass && superclass.prototype, { constructor: { value: subclass, enumerable: false, writable: true, configurable: true } });
    // 函数继承
    if (superclass) Object.setPrototypeOf(subclass, superclass); // subclass.__proto__ = superclass;
}

// 判断父类构造函数调用时有没有返回对象或者函数，有的话返回它，没有返回子类的this
function _possibleConstructorReturn(self, call) {
    if (!self) {
        // 还没有被初始化，super还没有调用
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

var Parent = function Parent(name) {
    _classCallCheck(this, Parent);
    this.name = name;
}
Parent.prototype.say = function() {
    console.log(`我叫${this.name}, 今年 ${this.age}`);
}

var Child = function(_Parent) {
    _inherits(Child, _Parent);
    function Child(name, age) {
        _classCallCheck(this, Child);
        var _this;
        // Child.getPrototypeof().call(this, name) super(name);
        // 不调用super 编译成
        // _possibleConstructorReturn(_this);
        _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Child).call(this, name));
        _this.age = age;
        return _this;
    }
    return Child;
}(Parent);

var lisi = new Child('lisi', 18);
lisi.say();