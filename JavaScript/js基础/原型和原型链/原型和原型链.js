/**
 * Created by wyw on 2019/2/26.
 */

// function Person(name){
// }
// Person.prototype.name = '';
// function Goods() {
//     this.name = 'Goods';
// }
//
// let lisi = new Person('lisi');

// 两条原型链
//  console.log(Person.__proto__ === Function.prototype, Function.prototype.__proto__ === Object.prototype, Object.prototype.__proto__ === null); // true true true

// console.log(lisi.__proto__ === Person.prototype, Person.prototype.__proto__ === Object.prototype,Object.prototype.__proto__ === null ); // true true true

// 实例对象没有prototype，自身也没有constructor，但是可以从原型链上继承constructor
// console.log(lisi.constructor === Person.prototype.constructor, Person.prototype.constructor === Person); // true true
// console.log(lisi.hasOwnProperty('constructor')); // false

// Person.prototype = new Goods();
// Person.prototype.constructor = Person;
// console.log(lisi, lisi.name);
// console.log(Person.prototype);
function Person(name){
    this.name = name;
}
Person.prototype.say = function () {
    console.log(this.name);
};
// console.log(Person.constructor === Function.prototype.constructor);
let lisi = new Person('lisi');
// console.log(lisi.constructor === Person.prototype.constructor);
let liwu = new Person('liwu');
// console.log(lisi.say === liwu.say); // true
// console.log(lisi.hasOwnProperty('say'), liwu.hasOwnProperty('say')); // false false
// Person.prototype.age = 18;
// console.log(lisi.age, liwu.age); // 18 18
// Person.prototype.age = 20;
// console.log(lisi.age, liwu.age); // 20 20
// lisi.say = function() {
//     console.log('oh nanana');
// };
// lisi.say();
// liwu.say();
// console.log(lisi);
// console.log(lisi.hasOwnProperty('say'), liwu.hasOwnProperty('say')); // true false
// function Chinese() {
//     this.country = '中国';
// }
// Person.prototype = new Chinese();
// Person.prototype.constructor = Person;
// let lisisi = new Person('lisisi');
// console.log(lisi, lisisi);
// console.log(lisisi.constructor === Chinese);
// console.log(lisisi instanceof Person);
// console.log(Person.prototype.isPrototypeOf(lisisi));
// console.log(Object.getPrototypeOf(lisisi));
// console.log(lisisi.constructor === Person); // true
// console.log(lisisi.__proto__ === Person.prototype);
// let a = 'oh nanana', b = 0, c = true;
// console.log(a.constructor, b.constructor, c.constructor);
// a.constructor = {};
// b.constructor = {};
// c.constructor = {};
// console.log(a.constructor, b.constructor, c.constructor);
// Object.defineProperty( Object.prototype, "__proto__", {
//     get: function() {
//         return Object.getPrototypeOf( this );
//     },
//     set: function(o) {
//         // ES6 中的 setPrototypeOf(..) 设置原型对象
//         Object.setPrototypeOf(this, o );
//         return o;
//     }
// // } );
// console.log(lisi.__proto__.__proto__.__proto__);
// console.log(Person.__proto__.__proto__.__proto__);
// function newObj() {
//     let o, f = [].shift.call(arguments); // 取出参数的第一个成员，即构造函数
//     o = Object.create(f.prototype); // 创建一个继承了构造函数原型的新对象
//     f.call(o, ...arguments); // 执行构造函数使得新对象获取相应属性
//     return o;
// }
// let zs = newObj(Person, 'zs');
// console.log(zs instanceof Person);
// console.log(zs);