/**
 * Created by wyw on 2018/12/17.
 */
function Promise(Fn){
    this.value;
    this.reason;
    this.resolves = [];
    this.rejects = [];
    this.status = 'PENDING';

    if(this.status === 'PENDING') {
        let transition = (status, val) => {
            setTimeout(_ => {
                this.status = status;
                let f = status === 'FULFILLED',
                    queue = this[f ? 'resolves' : 'rejects'];
                queue.forEach(fn => val = fn(val) || val);
                this[f ? 'value' : 'reason'] = val;
            });
        };

        var resolve = (value) => {
            transition('FULFILLED', value);
        };

        var reject = (reason) => {
            transition('REJECTED', reason);
        }
    }
    try {
        Fn(resolve, reject);
    }
    catch(err) {
        reject(err);
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    let promise = this;
    return new Promise((resolve, reject) => {
        function success(value) {
            let val = typeof onFulfilled === 'function' && onFulfilled(value) || value;
            if(val && typeof val['then'] === 'function'){ // 判断是否有then方法
                val.then(function(value){ // 如果返回的是Promise 则直接执行得到结果后再调用后面的then方法
                    resolve(value);
                },function(reason){
                    reject(reason);
                });
            }else{
                resolve(val);
            }
        }
        function erro (reason) {
            let rea = typeof onRejected === 'function' && onRejected(reason) || reason;
            reject(rea);
        }
        if (promise.status === 'PENDING') {
            promise.resolves.push(success);
            promise.rejects.push(erro);
        } else if (promise.status === 'FULFILLED') {
            success(promise.value);
        } else if (promise.status === 'REJECTED') {
            erro(promise.reason);
        }
    });
};


Promise.prototype.catch = function(onRejected){
    return this.then(null, onRejected);
};

// function getInfo(success, fail) {
//     return new Promise((resolve, reject) => {
//         setTimeout(_ => {
//             let ran = Math.random();
//             console.log(success, ran);
//             if (ran > 0.5) {
//                 resolve(success);
//             } else {
//                 reject(fail);
//             }
//         }, 200);
//     })
// }
//
// getInfo('Vchat', 'fail').then(res => {
//     console.log('1', res);
//     return getInfo('可以线上预览了', 'erro');
// }).catch(err => {
//     console.log('2', err);
// }).then(res => {
//     console.log('3', res);
// }).catch(err => {
//     console.log('4', err);
// });

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then(result => {console.log(result)})
    .catch(e => {
        console.log(e);
    });