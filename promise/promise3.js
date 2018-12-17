/**
 * Created by wyw on 2018/12/16.
 */

function Promise(fn){

    var promise = this;
    promise.status = 'PENDING';
    promise.value;
    promise.reason;
    promise.resolves = [];
    promise.rejects = [];

    this.then = function(onFulfilled, onRejected){
        // resolveCall = onFulfilled; // 后续的函数会把第一次附的值覆盖
        // rejectCall = onRejected;
        function success (value) {
            return typeof onFulfilled === 'function' ? onFulfilled(value) : value;
        }
        function erro (reason) {
            return typeof onRejected === 'function' ? onRejected(reason) : reason;
        }
        if (promise.status === 'PENDING') {
            promise.resolves.push(success);
            promise.rejects.push(erro);
        }else if(promise.status === 'FULFILLED'){ // 状态改变后的then操作，立刻执行
            success(promise.value);
        }else if(promise.status === 'REJECTED'){
            erro(promise.reason);
        }
        return promise;
    };
    this.catch = function(onRejected){
        return this.then(null, onRejected);
    };
    if(promise.status === 'PENDING') {
        function resolve(value){
            promise.status = 'FULFILLED';
            promise.value = value;
            setTimeout(_ => {
                promise.resolves.forEach(fn => {
                    promise.value = fn(promise.value) || value;
                });
            });
        }
        function reject(reason){
            promise.status = 'REJECTED';
            promise.reason = reason;
            setTimeout(_ => {
                promise.rejects.forEach(fn => {
                    promise.reason = fn(promise.reason) || reason;
                });
            });
        }
        fn(resolve, reject);
    }
}

new Promise((resolve, reject) => {
    setTimeout(_ => {
        let ran = Math.random();
        console.log(ran);
        if (ran > 0.5) {
            resolve('success');
        } else {
            reject('fail');
        }
    }, 200)
}).then(r => {
    console.log('res', r);
    return r + '---yes';
}).then(r => {
    console.log('data', r);
    return r + '---yes';
}).catch(err => {
    console.log('err', err);
});