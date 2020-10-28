function co(fn) {
    return new Promise((resolve, reject) => {
        const gen = fn();
        const onFulfilled = (res) => {
            try {
                const value = gen.next(res);
                next(value);
            } catch (error) {
                reject(error);
            }
        }
        const onRejected = (err) => {
            try {
                const reason = gen.throw(err);
            } catch (error) {
                reject(error);
            }
        }

        function next(res) {
            if(res.done) return resolve(res.value);
            Promise.resolve(res.value).then(onFulfilled, onRejected);
        }
        onFulfilled();
    })
}
function* test() {
    const e = yield new Promise(resolve => {
      setTimeout(() => {
        resolve('e');
      }, 1000);
    });
    const a = yield Promise.reject('a');
    const d = yield 'd';
    const b = yield Promise.resolve('b');
    const c = yield Promise.resolve('c');
    return [a, b, c, d, e];
}
co(test).then(r => {
    console.log(r)
})