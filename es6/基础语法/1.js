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
function add(x){
    var sum=x;
    var tmp=function(y){
        sum=sum+y;
        return tmp;
    };
    tmp.toString=function(){
        return sum;
    };
    return tmp;
}
console.log(add(1)(2)(3));
console.log(add(1)(2)(3)(4));