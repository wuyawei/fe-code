// 每隔 1s 输出 index，0、1、2、3、4
    // for(let i = 0; i < 5; i++) {
    //     setTimeout(() => {
    //         console.log(new Date(), i)
    //     }, i * 1000)
    // }
    // for(var i = 0; i < 5; i++) {
    //     (n => setTimeout(() => {
    //         console.log(new Date(), n)
    //     }, n * 1000))(i)
    // }
    
    // 间隔 0、1、2、3、4 s 并输出对应值
    const p = (n) => {
        return new Promise((resolve, reject) => setTimeout(() => {
            console.log(new Date(), n)
            resolve(n + 1);
        }, n * 1000))
    }
    function *fn() {
        const res = yield p(0);
        const res1 = yield p(res);
        const res2 = yield p(res1);
        const res3 = yield p(res2);
        yield p(res3);
    }
    const co = (fn) => {
        const gen = fn();
        const next = (res) => {
            const {value, done} = gen.next(res);
            if (done) return;
            value.then(res => next(res));
        }
        next();
    }
    co(fn)