class SyncHook{
    constructor(parmas) {
        this.hooks = [];
    }
    tap(name, fn) {
        this.hooks.push(fn);
    }
    call(...arg) {
        this.hooks.forEach(fn => fn(...arg));
    }
}
// 串行同步执行，不关心返回值
const hooks = new SyncHook(['num']);
hooks.tap('one', (num) => {
    console.log(num+1);
})
hooks.tap('two', (num) => {
    console.log(num+2);
})
hooks.tap('three', (num) => {
    console.log(num+3);
})
hooks.call(1);