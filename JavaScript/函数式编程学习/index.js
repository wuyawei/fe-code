const {log} = console;
function add(a,b,c) {
    return a + b + c;
}

function curry(fn) {
    const len = fn.length;
    return function bindfn() {
        if(arguments.length < len) {
            return bindfn.bind(null, ...arguments);
        } else {
            return fn.call(null, ...arguments);
        }
    }
}

const curryadd = curry(add);
log(curryadd(1)(2)(3));
log(curryadd(1, 2)(3));
log(curryadd(1, 2, 3));