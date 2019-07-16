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

// const _curry = fn => (...args) => fn.bind(null, ...args);

const curryadd = curry(add);
log(curryadd(1)(2)(3));
log(curryadd(1, 2)(3));
log(curryadd(1, 2, 3));
