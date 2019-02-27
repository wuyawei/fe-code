/**
 * Created by wyw on 2019/2/26.
 */

function Person(name){
}
Person.prototype.name = '';
function Goods() {
    this.name = 'Goods';
}

let lisi = new Person('lisi');

// 两条原型链
 console.log(Person.__proto__ === Function.prototype, Function.prototype.__proto__ === Object.prototype, Object.prototype.__proto__ === null); // true true true

console.log(lisi.__proto__ === Person.prototype, Person.prototype.__proto__ === Object.prototype,Object.prototype.__proto__ === null ); // true true true

// 实例对象没有prototype，自身也没有constructor，但是可以从原型链上继承constructor
console.log(lisi.constructor === Person.prototype.constructor, Person.prototype.constructor === Person); // true true
console.log(lisi.hasOwnProperty('constructor')); // false

// Person.prototype = new Goods();
// Person.prototype.constructor = Person;
// console.log(lisi, lisi.name);
console.log(Person.prototype);