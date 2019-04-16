// 实现一个forEach
// let arr = [3, 2, 1];
// Array.prototype.foreach = function (callback) {
//     let index = 0;
//     let arr = this.valueOf();
//     while (index < arr.length) {
//         callback(arr[index], index);
//         index ++;
//     }
// };
// arr.foreach((v, i) => {
//     console.log(v, i);
// });
// 支持异步的forEach
// let arr = [3, 2, 1];
// Array.prototype.foreach = async function (callback) {
//     let index = 0;
//     let arr = this.valueOf();
//     let values = this.values();
//     for (let o of values) {
//         await callback(arr[index], index);
//         index ++;
//     }
// };

// 或者
// Array.prototype.foreach = async function (callback) {
//     let index = 0;
//     let arr = this.valueOf();
//     while (index < arr.length) {
//         await callback(arr[index], index);
//         index ++;
//     }
// };
//
// function fetch(t) {
//     return new Promise((resolve, reject) => {
//         setTimeout(_ => {
//             console.log(t);
//             resolve(t);
//         }, t * 1000)
//     })
// }
// arr.foreach(async v => {
//     // await fetch(v);
//     console.log(v);
// });

//实现一个sleep
// function sleep(t) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, t);
//     })
// }
// async function test() {
//     await sleep(2000);
//     console.log('hahaha');
// }
//
// test();

// 实现一个 new
// function Person(name) {
//     this.name = name;
// }
// Person.prototype.say = function() {
//     console.log(this.name);
// };
// function newObj() {
//     // let o, f = [].shift.call(arguments);
//     let o, [f, ...arg] = arguments; // es6 写法
//     o = Object.create(f.prototype);
//     // let res = f.call(o, ...arguments);
//     let res = f.call(o, ...arg);
//     if (res && typeof res === 'object') return res; // 返回值为真,且是对象
//     return o;
// }
// let lisi = newObj(Person, 'lisi');
// let lisisi = new Person('lisisi');
// lisi.say();
// lisisi.say();
// console.log(lisi, lisisi);

// 实现一个柯里化