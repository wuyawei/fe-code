function add() { // 柯里化函数
    let arg = [...arguments];
    let rt = 0;
    let fn = function() {
        arg.push(...arguments);
        rt = arg.reduce((a, b) => a + b);
        return fn;
    };
    fn.toString = function() {
        return rt;
    };
    return fn;
}

let a = {
    n: 1,
    toString() {
        return this.n ++;
    }
};
if (a == 1 && a == 2 && a ==3) {
    console.log('oh nanana');
}