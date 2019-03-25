/**
 * Created by wyw on 2019/2/25.
 */
// function timeout(ms = 1000, value) {
//     return new Promise((resolve) => {
//         setTimeout(_ => {resolve(value);}, ms);
//     });
// }
//
// async function asyncPrint(ms) {
//     let value = await timeout(ms);
//     console.log(value);
// }
//
// function* genPrint(ms) {
//     let value = yield timeout(ms, 'hi');
//     console.log(value);
//     let oh = yield  timeout(ms, 'oh');
//     console.log(oh);
//     let na = yield  timeout(ms, 'nanana');
//     console.log(na);
// }
//
// let g = genPrint(1000);
// function co(gen) {
//     let g = gen();
//     function next(data) {
//         let res = g.next(data);
//         if (res.done) return res.value;
//         res.value.then(r => {
//             next(r);
//         });
//     }
//     next();
// }
// co(genPrint);
// asyncPrint(2000, 'hahaha');

// promise generator async 实现依次调用异步操作
function spawn(gen) { // generator自动执行器
    return new Promise((resolve, reject) => {
        let g = gen();
        function step(nextF) {
            let next;
            try {
                next = nextF();
            } catch (e) {
                return reject(e);
            }
            if (next.done) return resolve(next.value);
            Promise.resolve(next.value).then(r => {
                step(_ => g.next(r));
            }).catch(e => {
                step(_ => gen.throw(e));
            })
        }
        step(_ => g.next());
    })
}
function f1() {
    console.time();
    return new Promise((resolve, reject) => {
        setTimeout(_ => {resolve('f1');console.timeEnd();}, 1000);
    })
}
function f2(val) {
    console.time();
    return new Promise((resolve, reject) => {
        setTimeout(_ => {console.log(val);resolve('f2');console.timeEnd();}, 1000);
    })
}
function f3(val) {
    console.time();
    return new Promise((resolve, reject) => {
        setTimeout(_ => {console.log(val);resolve('f3');console.timeEnd();}, 1000);
    })
}

function chainPromise(array) {
    let ret = null;
    let p = Promise.resolve();
    for(let f of array) {
        p = p.then(function(val) {
            ret = val;
            return f(val);
        });
    }
    return p.catch(function(e) {
    }).then(function(re) {
        console.log(re);
        return ret;
    });
}
function chainGenerator(array) {
    return spawn(function* () {
        let res;
        try {
            for (let f of array) {
                res = yield f(res);
            }
        } catch(e) {
            console.log(e);
        }
        return res;
    });
}
async function chainAsync(array) { // 可以看到async 相当于内置封装了一个spawn函数 默认返回
    let res;
    try {
        for (let f of array) {
            res = await f(res);
        }
    } catch(e) {
        console.log(e);
    }
    return res;
}
let arr = [f1, f2, f3];
// chainPromise(arr);
// chainGenerator(arr);
// chainAsync(arr);