const _compose = arr => (...arg) => arr.reduce((pre,cur) => cur(pre), arg);
const queue = arr => (...arg) => {
    let result = null;
    arr.forEach((fn, i) => {
        if (i===0) {
            result = fn(...arg);
        }else{
            result = fn(result);
        }
    })
}
class SyncHook{
    constructor(parmas) {
        this.hooks = [];
    }
    tap(name, fn) {
        this.hooks.push(fn);
    }
    call(...arg) {
        queue(this.hooks)(...arg)
    }
}
// 将执行完的返回值传给下一个函数
const hooks = new SyncHook(['num']);
hooks.tap('one', (num) => {
    console.log(num);
    return num+1;
})
hooks.tap('two', (num) => {
    console.log(num);
    return num+2;
})
hooks.tap('three', (num) => {
    console.log(num);
    return num+3
})
hooks.call(1);