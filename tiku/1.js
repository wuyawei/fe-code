// 实现一个forEach
// let arr = [3,2,1,NaN,{}];
// let obj = {name: 'a'};
// Array.prototype.myforeach = function (fn, context = null) {
//     let index = 0;
//     let arr = this;
//     if (typeof fn !== 'function') {
//          throw new TypeError(fn + ' is not a function');
//     }
//     while (index < arr.length) {
//         if (index in arr) {
//             fn.call(context, arr[index], index, arr);
//         }
//         index ++;
//     }
// };
// arr.myforeach(function (v, i, array) {
//     console.log(v, i, array, this.name);
// }, obj);
// 支持异步的forEach
// let arr = [3, 2, 1];
// Array.prototype.foreach = async function (callback) {
//     let index = 0;
//     let arr = this;
//     let values = this.values();
//     for (let o of values) {
//         await callback(arr[index], index);
//         index ++;
//     }
// };

// 或者
// Array.prototype.myforeach = async function (fn, context = null) {
//     let index = 0;
//     let arr = this;
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < arr.length) {
//         if (index in arr) {
//             try {
//                 await fn.call(context, arr[index], index, arr);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//         index ++;
//     }
// };
//
// function fetch(t) {
//     return new Promise((resolve, reject) => {
//         setTimeout(_ => {
//             console.log(t);
//             // resolve(t);
//             reject('err')
//         }, t * 1000)
//     })
// }
// arr.myforeach(async v => {
//     await fetch(v);
//     // console.log(v);
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
// console.log(add(1,2)(3)(5)) // 11

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

// Array.prototype.mymap = function (fn, context = null) {
//     let arr = this;
//     let len = arr.length;
//     let index = 0;
//     let newArr = [];
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < len) {
//         if (index in arr) {
//             let result = fn.call(context, arr[index], index, arr);
//             newArr[index] = result;
//         }
//         index ++;
//     }
//     return newArr;
// };
//
// let a = arr.mymap((v, i) => {
//     console.log(i);
// });
// console.log(a);

// Array.prototype.myreduce = function (...arg) {
//     let arr = this;
//     let len = arr.length;
//     let index = 0;
//     let fn = arg[0], result;
//     if (arg.length >= 2) {
//         result = arg[1];
//     } else {
//         while (index < len && !(index in arr)) {
//             index++;
//         }
//         console.log('index', index);
//         if (index >= len) {
//             throw new TypeError( 'Reduce of empty array ' +
//                 'with no initial value' );
//         }
//         result = arr[index++];
//     }
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < len) {
//         if (index in arr) {
//             result = fn(result, arr[index], index, arr);
//         }
//         index ++;
//     }
//     return result;
// };

// let a = arr.myreduce((pre, cur, i, a) => {
//     console.log('r', pre, i);
//     return pre + i;
// });
// console.log(a);

// Array.prototype.mapByreduce = function (fn, context = null) {
//     let arr = this;
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     return arr.reduce((pre, cur, index, array) => {
//         let res = fn.call(context, cur, index, array);
//         return [...pre, res];
//     }, []);
// };
//
// let a = arr.mapByreduce((v, i) => {
//     console.log(v, i);
//     return v * i;
// });
// console.log(a);

// Array.prototype.myfilter = function (fn, context = null) {
//     let arr = this;
//     let len = arr.length;
//     let index = 0, k = 0;
//     let newArr = [];
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < len) {
//         if (index in arr) {
//             let result = fn.call(context, arr[index], index, arr);
//             if (result) {
//                 newArr[k++] = arr[index];
//             }
//         }
//         index ++;
//     }
//     return newArr;
// };

// Array.prototype.myfind = function (fn, context = null) {
//     let arr = this;
//     let len = arr.length;
//     let index = 0;
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < len) {
//         if (index in arr) {
//             let result = fn.call(context, arr[index], index, arr);
//             if (result) {
//                 return arr[index];
//             }
//         }
//         index ++;
//     }
//     return undefined;
// };

// Array.prototype.mysome = function (fn, context = null) {
//     let arr = this;
//     let len = arr.length;
//     let index = 0;
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < len) {
//         if (index in arr) {
//             let result = fn.call(context, arr[index], index, arr);
//             if (result) return true;
//         }
//         index ++;
//     }
//     return false;
// };

// Array.prototype.myevery = function (fn, context = null) {
//     let arr = this;
//     let len = arr.length;
//     let index = 0;
//     if (typeof fn !== 'function') {
//         throw new TypeError(fn + ' is not a function');
//     }
//     while (index < len) {
//         if (index in arr) {
//             let result = fn.call(context, arr[index], index, arr);
//             if (!result) return false;
//         }
//         index ++;
//     }
//     return true;
// };

// Array.prototype.myincludes = function (val, fromIndex = 0) {
//     let arr = this;
//     let len = arr.length;
//     let k = Math.max(fromIndex >= 0 ? fromIndex : len - Math.abs(fromIndex), 0);
//     function check(x, y) {
//         return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y))
//     }
//     while (k < len) {
//         if (k in arr) {
//             if (check(val, arr[k])) return true;
//         }
//         k ++;
//     }
//     return false;
// };

// Array.prototype.myindexOf = function (val, fromIndex = 0) {
//     let arr = this;
//     let len = arr.length;
//     let k = Math.max(fromIndex >= 0 ? fromIndex : len - Math.abs(fromIndex), 0);
//     while (k < len) {
//         if (k in arr) {
//             if (val === arr[k]) return k;
//         }
//         k ++;
//     }
//     return -1;
// };

// Array.prototype.myjoin = function (connector = ',') {
//     let arr = this;
//     let len = arr.length;
//     let str = '';
//     let k = 0;
//     while (k < len) {
//         if (k in arr) {
//             if (k === len -1) {
//                 str += arr[k]
//             } else {
//                 str += arr[k] + connector.toString();
//             }
//         }
//         k ++;
//     }
//     return str;
// };

// Array.prototype.mypop = function () {
//     let arr = this;
//     let len = arr.length;
//     let res = arr[len -1];
//     delete arr[len -1];
//     arr.length = len - 1;
//     return res;
// };
//
// Array.prototype.mypush = function (val) {
//     let arr = this;
//     let len = arr.length;
//     arr[len+1] = val;
//     return arr;
// };

// 函数式
// const {log} = console;
// const compose = (...fns) => fns.reduce((f, g) => {
//     return (...args) => g(f(...args));
// });
// compose(r => r + 1, r => r + 2, log)(5);

// function findParent({
//     key, data
// }) { // 查找父级
//     let parent = {};
//     data.forEach((v) => {
//         if (v.children) {
//             if (v.children.some(k => k.id === key)) {
//                 parent = v;
//             } else {
//                 parent = findParent({
//                     key, data: v.children
//                 });
//             }
//         }
//     });
//     console.log('parent22222', parent);
//     return parent;
// }

function findParent({
    key, data, callback = function() {}, id = 'id'
}) { // 查找父级
    let parent = {};
    data.forEach((v) => {
        if (v.children) {
            if (v.children.some(k => k[id] === key)) {
                parent = v;
                callback(v.children);
            } else {
                parent = findParent({
                    key, data: v.children, callback, id
                });
            }
        }
    });
    return parent;
}

function findId({
    key, data, callback = function() {}, id = 'id'
}) { // 查找id对应的数据
    let item = {};
    data.forEach((v) => {
        if (key === v[id]) {
            callback(v);
            item = v;
        } else if (v.children) {
            item = findId({
                key, data: v.children, callback, id
            });
        }
    });
    return item;
}

const data = [
    {
        id: '1',
        name: '题目树1',
        children: [
            {
                id: '2',
                name: '题目1-1',
                children: [
                    {
                        id: '24',
                        name: '题目1-24'
                    },
                    {
                        id: '6',
                        name: '题目1-6'
                    }
                ]
            },
            {
                id: '3',
                name: '题目1-2',
                children: [
                    {
                        id: '28',
                        name: '题目1-28',
                        children: [
                            {
                                id: '243',
                                name: '题目1-243'
                            },
                            {
                                id: '64',
                                name: '题目1-64'
                            }
                        ]
                    },
                    {
                        id: '35',
                        name: '题目1-35'
                    }
                ]
            }
        ]
    }
];


// console.log('1111', findId({ key: '64',  data: JSON.parse(JSON.stringify(data))}).id); // 查找父级

// class A{
//     constructor() {
//         return {a: '1'}
//     }
//     getA() {
//         console.log(this.a)
//     }
// }

// const a = new A(); // 直接返回return的对象
// console.log("a", a)
// a.getA()

// let arr = [1,2,3];
// arr.reduceMap= function(callback) {
//    return this.reduce((pre, cur) => [...pre, callback(cur)], []);
// }
// console.log("arr.map", arr.reduceMap((v, i) => v * 2));


// 斐波那契
// 0 1 1 2 3 5 8 
// 普通
function fibnacci(n) {
    if(n === 0) return 0;
    if(n === 1) return 1;
    return fibnacci(n - 1) + fibnacci(n -2);
}
// console.log("fibnacci(5)", fibnacci(5));

// 尾递归
function fibnacci1(n, a1, a2) {
    if(n === 0) return a1;
    return fibnacci1(n - 1, a2, a1 + a2 );
}
// console.log("fibnacci1(6)", fibnacci1(5, 0, 1));

// 迭代
function fibnacciWithLoop(n, a1 = 0, a2 = 1) {
    while(n-- > 0) {
        [a1, a2] = [a2, a1 + a2];
    }
    return a1;
}
// console.log("fibnacciWithLoop -> fibnacciWithLoop", fibnacciWithLoop(5, 0, 1));

// 蹦床函数
// 如果函数返回值是一个函数，就继续调用，直到不是函数
function trampoline(f) {
    while (f && f instanceof Function) {
      f = f();
    };
    return f;
}
function fibnacciWithTram(n, a1 = 0, a2 = 1) {
    if(n === 0) return a1;
    return fibnacci1.bind(null, n - 1, a2, a1 + a2);
} 
// console.log("trampoline", trampoline(fibnacciWithTram(8000)));

// n 的阶乘
// 非尾递归
function factorial1(n) {
    if(n === 1) return 1;
    return n * factorial1(n - 1);
}
// console.log("factorial1 -> factorial1", factorial1(5));

// 尾递归
// 核心思路是把return 的表达式，改写在尾部调用函数的参数中
// 保证尾调用函数在运行时，不依赖外层函数的变量等
function factorial(n, total) {
    if(n === 1) return n * total;
    return factorial(n - 1, n * total);
}
// console.log("factorial -> factorial", factorial(100, 1));

// 数组的拍平
const isArray = arr => Array.isArray(arr);
const myflat = (arr) => {
    let result = [];
    arr.forEach(v => {
        if(isArray(v)) {
            const res = myflat(v);
            result = result.concat(res);
        } else {
            result.push(v);
        }
    })
    return result;
}
const arr1 = [1,2,[3,4,[5,6]]];
// console.log("myflat(arr1)", myflat(arr1));

const myflat1 = (arr) => {
    return arr.reduce((pre, cur) => {
        let res = [];
        if(isArray(cur)) {
            res = res.concat(myflat1(cur));
        } else {
            res.push(cur);
        }
        return [...pre, ...res];
    }, []);
}
console.log("myflat1", myflat1(arr1));