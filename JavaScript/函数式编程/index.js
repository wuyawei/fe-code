const {log} = console;
// function add(a,b,c) {
//     return a + b + c;
// }
// function curry(fn) {
//     const len = fn.length;
//     return function bindfn() {
//         if(arguments.length < len) {
//             return bindfn.bind(null, ...arguments); // 关键：保存参数，并在调用时和后面的参数一起传入 bindfn
//         } else {
//             return fn.call(null, ...arguments);
//         }
//     }
// }
// function add(a, b) {
//     return a + b
// }
// const curryAdd = curry(add);
// log(curryAdd(1)(2))
//
// function _curry(fn, ...p) {
//     const len = fn.length;
//     function warp (..._arguments) {
//         let _arg = [...p,..._arguments];
//         if (_arg.length >= len) {
//             return fn(..._arg);
//         }
//         function fnc(...args) {
//             _arg = [..._arg, ...args];
//             if (_arg.length < len) {
//                 return fnc;
//             } else {
//                 return fn(..._arg);
//             }
//         }
//         return fnc;
//     }
//     return warp;
// }
//
// function simCurry(fn) {
//     const len = fn.length;
//     function warp (..._arguments) {
//         let _arg = _arguments;
//         if (_arg.length >= len) {
//             return fn.bind(null, ..._arg);
//         }
//         function fnc(...args) {
//             _arg = [..._arg, ...args];
//             if (_arg.length < len) {
//                 return fnc;
//             } else {
//                 return fn.bind(null, ..._arg);
//             }
//         }
//         return fnc;
//     }
//     return warp;
// }
//
// function simCurry2(fn) {
//     function warp (..._arguments) {
//         let _arg = _arguments;
//         function fnc(...args) {
//             _arg = [..._arg, ...args];
//             if (args.length > 0) {
//                 return fnc;
//             } else {
//                 return fn(..._arg);
//             }
//         }
//         return fnc;
//     }
//     return warp;
// }

// const _curry = fn => (...args) => fn.bind(null, ...args);

// function addInfinity(...args) {
//     return args.reduce((pre, cur) => pre + cur);
// }
// const curryadd = simCurry2(addInfinity);
// log(curryadd(1)(2)(3));
// log(curryadd(1, 2)(3)(4));
// log(curryadd(1, 2, 3, 4, 5));

// log(add.bind(null, 1)(2,3));
// log(add.bind(null, 1, 2)(3));
// log(add.bind(null, 1).bind(null,2).bind(null, 3)());

// const hi = name => `Hi ${name}`;
// const greeting = name => hi(name);
// // 太傻了
// const getServerStuff = callback => ajaxCall(json => callback(json));

// // 这才像样
// const getServerStuff = ajaxCall;

// function handleClick(id) {
//     log(id); // do something
// }


// Function.prototype.mybind = function() {
//     const [context, ...args] = arguments;
//     const f = this;
//     const fNOP = function() {};
//     const fBound = function(..._arg) {
//         // fNOP.prototype.isPrototypeOf(this)  判断是否是 new 调用的 fBound
//         return f.apply(fNOP.prototype.isPrototypeOf(this)
//                 ? this
//                 : context,
//                 [...args, ..._arg]);
//     };
//     if (this.prototype) {
//         fNOP.prototype = this.prototype;
//     }
//     fBound.prototype = new fNOP();
//     return fBound;
// };

// function add(a, b) {
//     return a + b;
// }
//
// const addBind = add.bind(null, 1);
// log(addBind(1));

// function add(a) {
//     return function (b) {
//         return a + b;
//     }
// }
//
// const increment = add(1);
// log(increment(3));

// function request(url, params) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => resolve(url), 1000);
//     })
// }

// function getData(params) {
//     return request('/api/getData', params);
// }
// function setData(params) {
//     return request('/api/setData', params);
// }
// const getData = _curry(request, '/api/getData');
// const setData = _curry(request, '/api/setData');
// getData('params').then(r => log(r));
// setData('params').then(r => log(r));

// [1,2,3].map(x => 2 * x);

// function multiply2(x) {
//     return 2 * x;
// }

// function mapMultiply2(arr) {
//     return arr.map(multiply2);
// }

// function map(fn, arr) {
//     return arr.map(fn);
// }

// const mapMultiply2 = curry(map, multiply2);

// 组合
// const compose = (...fns) => fns.reverse().reduce((f, g) => {
//     return (...args) => g(f(...args));
// });
// 可以接受多个参数
// const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
// compose(log,r => r + 1, (x,y,z) => x+y+z)(1,2,3);
// // 从右往左
// const compose2 = (...fns) => fns.reduceRight((f, g) => (...args) => g(f(...args)));
// compose2(log,r => r + 1, (x,y,z) => x+y+z)(1,2,3);


function add(a, b, c) {
    return a + b + c;
}
function _curry(fn, ..._arg) {
    const len = fn.length;
    return  function fnc(...args) {
        _arg = [..._arg, ...args];
        if (_arg.length < len) { // 参数不够，继续返回函数
            return fnc;
        } else { // 参数足够，执行原函数
            return fn(..._arg);
        }
    };
}

const _curryAdd = _curry(add, 1); 
console.log("_curryAdd()", _curryAdd(2)()(1))
