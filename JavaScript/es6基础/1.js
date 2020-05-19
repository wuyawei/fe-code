// 扩展运算符、rest运算符
// let p = [1,2,3];
// function test(args) {
//     [...args].forEach(v => console.log('test', v));
// }
// function test1(...args) {
//     args.forEach(v => console.log('test1', v));
// }
// test(p);
// test1(...p);
// 1  2  3

// let a1 = [1, 2];
// let a2 = [...a1];
// let [...a3] = a1;
// console.log(a2, a3);
// [1, 2]

// let s = [...'hello'];
// console.log(s);

// let dom = document.querySelector('p');
// console.log([...dom]);

// es6数组方法
// let arrayLike = {
//     '0': 1,
//     '1': 2,
//     '2': 3,
//     length: 3
// };
// let arr2 = Array.from(arrayLike);
// let arr2 = Array.from(arrayLike, v => 2 * v);
// let arr2 = Array.from(arrayLike).map(v => 2 * v);
// console.log(arr2);

// let p = {price: 3};
// let a = [2, 3, 5, 1].find(function(n) { return n > this.price }, p);
// console.log(a);

// let i = 0;
// let a = i++;
// let b = ++i;
// console.log(a, b); // 0 2

// es5数组方法
// let arr = [{name: 'a', id: '1'}, {name: 'a', id: '2'}];
// let f1 = arr.every(v => {
//    return v.id === '1';
// });
// let f2 = arr.some(v => {
//     return v.id === '1';
// });
// let f3 = arr.filter(v => {
//     return v.id === '1';
// });
// let f4 = arr.map(v => {
//     return v.id;
// });
// console.log(f1,f2,f3,f4);
// let arr = [{name: '红烧牛肉饭', price: 29}, {name: '黄焖鸡米饭', price: 22}, {name: '农家小炒肉', price: 28}];
// let price_all = arr.reduce((prev, curr, index, arr) => {
//     return prev + curr.price;
// }, arr[0].price);
// console.log(price_all);
// let goods = arr.reduce((prev, curr, index, arr) => {
//     if (index === arr.length -1) {
//         return prev + curr.name;
//     }
//     return prev + curr.name + ' + ';
// }, '您选择的商品为：');
// console.log(goods);

// 迭代器
// let obj = { // 给对象添加迭代器
//     [Symbol.iterator]() {
//         return {
//             next: function () {
//                 return {
//                     value: 'hahaha',
//                     done: false
//                 };
//             }
//         };
//     }
// };
// for (let v of obj) {
//     console.log(v)
// }

// 对象的扩展
// let obj = { // es5不能在这里写[]
//     name: 'lisi',
//     age: 18
// };
// obj.name = 'lisisi';
// obj['age'] = 18;
// // [] 里可以写表达式
// let say = 'say';
// obj[say] = function(){
//     console.log(this.name);
// };
// obj.say();
//
// let wangwu = {
//     name: 'wangwu',
//     [say]() {
//         console.log(this.name);
//     }
// };
// wangwu.say();

// 获取对象属性的描述
// let obj = { name: 'lisi' };
// Object.getOwnPropertyDescriptor(obj, 'name');
// console.log(Object.getOwnPropertyDescriptor(obj, 'name'));

// 遍历对象的次序
// let obj = {
//     [Symbol()]: 0,
//     '6': 0,
//     '0': 0,
//     'hi': 'hello',
//     '3': 0
// };
// console.log(Reflect.ownKeys(obj));
// for (let k in obj) {
//     console.log(k);
// }

// Object.is()

// a = Object.is('hello', 'hello'); // true
// b = Object.is({}, {}); // false
// c = Object.is([], []); // false
// d = +0 === -0; //true
// e = NaN === NaN; // false
// f = Object.is(+0, -0); // false
// g = Object.is(NaN, NaN); // true
// console.log(a, b, c, d, e, f, g);

// Object.assign()
// let obj1 = {name: 'lisi', age: 16};
// let obj2 = {age: 18};
// let obj3 = {name: 'zhangsan', age: 22};
// console.log(Object.assign(obj1, obj2, obj3));

// const map = new Map().set('name', 'lisi').set('age', 18);
// console.log(Object.fromEntries(map)); // 谷歌不支持 { name: "lisi", age: 18 }

// 函数默认值
// function fn1({x = 1, y = 2}) {
//     console.log(x + y);
// }
// function fn(x, y = 2, z) {
//     console.log(x + y);
// }
// console.log(fn.length);
// fn1({x: 2}); // 4

// function Fibonacci(n) {
//     if (n < 3) {
//         return 1;
//     }
//     return Fibonacci(n -1) + Fibonacci(n -2);
// }
// console.log(Fibonacci(10), Fibonacci(40));

// function Fibonacci(n, a1 = 1, a2 = 1) { // 1,1  1,2  2,3  3,5
//     if (n <= 2) {
//         return a2;
//     }
//     return Fibonacci(n -1, a2, a1 + a2);
// }
//
// console.log(Fibonacci(100));

// 普通阶乘函数
// function factorial(n) {
//     if (n <= 1) return 1;
//     return n * factorial(n-1);
// }
// console.log(factorial(5)); // 120

// 尾调用阶乘
// function factorial(n, total = 1) {
//     if (n <= 1) return total;
//     return factorial(n-1, n*total);
// }
// console.log(factorial(5)); // 120

// function trampoline(f) { // 蹦床函数
//     while (f && f instanceof Function) {
//         f = f();
//     }
//     return f;
// }

// 柯里化阶乘
// function factorial(n, total = 1) {
//     if (n <= 1) return total;
//     return factorial(n-1, n*total);
// }
// function curring(fn, ...arg) {
//     return function (..._arg) {
//         let args = [..._arg, ...arg];
//         return fn(...args);
//     };
// }
// let curringFactorial = curring(factorial, 1);
// console.log(curringFactorial(5)); // 120

// 柯里化
// function add(x){
//     var sum=x;
//     var tmp=function(y){
//         sum=sum+y;
//         return tmp;
//     };
//     tmp.toString=function(){
//         return sum;
//     };
//     return tmp;
// }
// let a = add(1);
// console.log(a, add(1)(2)(3)); // ƒ 1 ƒ 6
//
// function CurryingAdd(...arg) {
//     let args = [...arg];
//     let fn = function (..._arg) {
//         args = [...args, ..._arg];
//         return fn;
//     };
//     /*fn.valueOf = function () {
//         return 1;
//     };*/
//     fn.toString = function () {
//         return args.reduce((m, n) => {
//             return m + n;
//         })
//     };
//     return fn;
// }
// console.log(CurryingAdd(1)(3)(5)); // 9

// symbol
// let obj = {
//     toString() {
//         return 'hello';
//     },
//     valueOf() {
//         return 'haha';
//     }
// };
// let fn = function () {};
// fn.toString = function () {
//     return 'world';
// };
// fn.valueOf = function () {
//     return 'nihao';
// };
//
// let s1 = Symbol(obj);
// let s2 = Symbol(fn);
// console.log(s1, s2);

// let s1 = Symbol('name');
// let s2 = Symbol('name');
// let obj = {
//     [s1]: 'zs',
//     [s2]() {
//         return 'ls';
//     },
//     say() {
//        return this.name;
//     }
// };
// console.log(obj[s1], obj[s2]());
// console.log(obj.s1);
// obj.s1 = 'wyw';
// // console.log(obj.s1, obj['s1']);
// console.log(Object.getOwnPropertySymbols(obj));
// console.log(Reflect.ownKeys(obj));
// for (let k in obj) {
//     console.log(k);
// }

// let s1 = Symbol.for();
// let s2 = Symbol.for();
// let s3 = Symbol.for('undefined');
// let s4 = Symbol.for('name');
// let s5 = Symbol('name');
// console.log(s1 === s2, s2 === s3, s4 === s5, Symbol.keyFor(s1), Symbol.keyFor(s5));

// Symbol.hasInstance
// class Person{
//     static [Symbol.hasInstance](obj) {
//         return true;
//     }
// }
// console.log(1 instanceof Person);
// Symbol.isConcatSpreadable
// let arr = [1,2,3];
// console.log(arr[Symbol.isConcatSpreadable]); // undefined
// arr[Symbol.isConcatSpreadable] = false;
// let arr1 = arr.concat([4,5]);
// console.log(...arr1);

// let handle = function(type) {
//     switch (type) {
//         case 'number':
//             return 8;
//         case 'string':
//             return '好嗨哟';
//         case 'default':
//             return 'hello world';
//         default:
//             throw new Error();
//     }
// };
// let obj = {
//     [Symbol.toPrimitive] : handle,
//     toString() {
//         return 'String';
//     }
// };
// let fn = function () {};
// fn.toString = function () {
//     return 'oh nanana';
// };
// fn[Symbol.toPrimitive] = handle;
// console.log(obj * 2);
// console.log(obj + '!!!');
// console.log(Number(obj));
// console.log(String(obj));
// console.log(String(fn));

// set
// let s = new Set();
// s.add(2).add(3).add(2);
// let s1 = new Set([1,1,2,2,3]);
// let obj = {
//     [Symbol.iterator]() {
//         let index = 0;
//         return {
//             next: function () {
//                 if (index < 3) {
//                     return {
//                         value: index++,
//                         done: false
//                     };
//                 }
//                 return {
//                     value: 'undefined',
//                     done: true
//                 };
//             }
//         };
//     }
// };
// let s2 = new Set(obj);
// console.log(s); // Set { 2, 3 }
// console.log(s1);
// console.log(s2);

// let s = new Set();
// s.add(NaN).add(NaN).add({}).add({});
// console.log(s); // Set { NaN, {}, {} }
// let s = new Set();
// s.add(1).add(3).add(5);
// console.log(s, s.size);
// s.delete(3);
// console.log(s.has(3), s);
// for (let v of s.keys()) {
//     console.log(v);
// }
// for (let v of s.values()) {
//     console.log(v);
// }
// for (let v of s.entries()) {
//     console.log(v);
// }
//
// // 因为set的遍历器生成函数就是它的values方法，Set.prototype[Symbol.iterator] === Set.prototype.values
// // 所以values方法等同于
// for (let v of s) {
//     console.log(v);
// }
// //
// s.forEach((v, k) => console.log(k + '=>' + v));
// // 结合filter实现取两个set的交集
// console.log(new Set([...s].filter(x => new Set([1]).has(x))));

// let clock = function* () {
//     while (true) {
//         console.log('Tick!');
//         yield;
//         console.log('Tock!');
//         yield;
//     }
// };
// let c = clock();
// c.next();
// c.next();
// function* gen() {
//     yield false;
// }
// let i = 0;
// let t = setInterval(function g() {
//     let v = gen().next().value;
//     i++;
//     if (v || i>2) {
//         clearInterval(t);
//     }
//     return g;
// }(), 2000);

// let arr = [6,2,3,4,5,6];
// delete arr[2];
// arr = arr.flat();
// console.log(arr);
// function slice(arr, i) {
//     let set = new Set();
//     for (let k in arr) {
//         if (k != i) {
//             set.add(arr[k]);
//         }
//     }
//     return [...set];
// }
// console.log(slice(arr, 0));
// let foo = function() {
//     console.log(1)
// };
// (function foo() {
//     foo = 10;
//     console.log(foo)
// }() );
// console.log(foo);

// let arr1 = ['a','a','a', 'b', 'b', 'c'];
// let arr2 = arr1.map((v, i, arr) => i + 1 - arr.indexOf(v));
// console.log(arr2); // [ 1, 2, 3, 1, 2, 1 ]
// let arr = [1,2,3,4,5,6];
// arr.forEach((v, i) => {
//     arr[i] = i;
// });
// console.log(arr);

function fetch(t) {
    return new Promise((resolve, reject) => {
        setTimeout(_ => {
            let ran = Math.random();
            console.log(ran);
            if (ran > 0.5) {
                resolve(t);
            } else {
                reject('<');
            }
        }, t * 1000)
    })
}
let arr = [3, 2, 1];
async function test() {
    for (let o of arr) {
        try {
            let res = await fetch(o);
            console.log(res);
            if (res) {
                console.log('end');
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }
}
// test();

// arr.forEach(async v =>{
//     let res = await fetch(v);
//     console.log(res);
// });
Array.prototype.foreach = async function (callback) {
    let index = 0;
    let arr = this.valueOf();
    while (index < arr.length) {
        await callback(arr[index], index);
        index ++;
    }
};
arr.foreach(async v => {
    try {
        let res = await fetch(v);
        console.log(res);
    } catch (e) {
        console.log(e);
    }
});
