const {log} = console;
function add(a,b,c) {
    return a + b + c;
}
function curry(fn) {
    const len = fn.length;
    return function bindfn() {
        if(arguments.length < len) {
            return bindfn.bind(null, ...arguments); // 关键：保存参数，并在调用时和后面的参数一起传入 bindfn
        } else {
            return fn.call(null, ...arguments);
        }
    }
}

function _curry(fn) {
    const len = fn.length;
    function warp (..._arguments) {
        let _arg = _arguments;
        if (_arg.length >= len) {
            return fn(..._arg);
        }
        function fnc(...args) {
            _arg = [..._arg, ...args];
            if (_arg.length < len) {
                return fnc;
            } else {
                return fn(..._arg);
            }
        }
        return fnc;
    }
    return warp;
}

function simCurry(fn) {
    const len = fn.length;
    function warp (..._arguments) {
        let _arg = _arguments;
        if (_arg.length >= len) {
            return fn.bind(null, ..._arg);
        }
        function fnc(...args) {
            _arg = [..._arg, ...args];
            if (_arg.length < len) {
                return fnc;
            } else {
                return fn.bind(null, ..._arg);
            }
        }
        return fnc;
    }
    return warp;
}

function simCurry2(fn) {
    function warp (..._arguments) {
        let _arg = _arguments;
        function fnc(...args) {
            _arg = [..._arg, ...args];
            if (args.length > 0) {
                return fnc;
            } else {
                return fn(..._arg);
            }
        }
        return fnc;
    }
    return warp;
}

// const _curry = fn => (...args) => fn.bind(null, ...args);

function addInfinity() {
    return [...arguments].reduce((pre, cur) => pre + cur);
}
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


function mybind() {
    let [context, ...args] = arguments;
    fToBind = this,
    fBound  = function() {
        // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
        return fToBind.apply(this instanceof fBound
                ? this
                : context,
                [...args, ...arguments]);
    };
    return fBound;
}