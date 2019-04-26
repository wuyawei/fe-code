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
// function add(...arg) {
//     return arg.reduce((pre, cur) => pre + cur);
// }
// function curry() {
//     let [fn, ...arg] = arguments;
//     return function(..._arg) {
//         return fn.call(this, ...[...arg, ..._arg]);
//     }
// }
// let addCurry = curry(add, 1,2,3);
// addCurry(4,5) // 15

// 累加 add
// function add(...arg) {
//     let args = arg;
//     let ret = function(..._arg) {
//         args = [...args, ..._arg];
//         return ret;
//     };
//     ret.toString = function() {
//         return args.reduce((pre, cur) => pre + cur);
//     };
//     return ret;
// }
// add(1,2)(3)(5) // 10

// 函数防抖
// function debounce(fn, delay, imadiate) { // imadiate 是否立即执行
//     let timer = null;
//     return function(...arg) {
//         let callbackNow = !timer && imadiate;
//         if (timer) clearTimeout(timer);
//         timer = setTimeout(() => {
//             timer = null;
//             if (!imadiate) fn.call(this, ...arg);
//         }, delay);
//
//         if (callbackNow) fn.call(this, ...arg);
//     }
// }

// 函数节流
// function throttle(fn, delay) {
//     let pre = +new Date();
//     let timer = null;
//     return function(... arg) {
//         let now = +new Date();
//         let diff = now - pre;
//         if (timer) clearTimeout(timer);
//         if (diff > delay) {
//             fn.call(this, ...arg);
//             pre = now;
//         } else {
//             timer = setTimeout(() => {
//                 fn.call(this, ...arg);
//                 pre = +new Date();
//                 timer = null;
//             }, delay)
//         }
//     }
// }

// 替换一段文本中指定字符的方法
// 将 good 替换成 [good]
// let text = 'Good morning, and in case I don\'t see you, good afternoon, good evening, and good night!';
// let str = '';
// let key = 'good';
// *
// while (~text.indexOf(key)) {
//     let s = text.slice(0, text.indexOf(key) + 4);
//     text = text.replace(s, '');
//     str += s.replace(key, (v) => '[' + v + ']');
// }
// text = str + text;
// console.log(text);
// *
// text = text.replace(new RegExp(key, 'g'), (v) => '[' + v + ']');
// console.log(text);
// *
// text = text.split(key).join('['+ key +']');
// console.log(text);

