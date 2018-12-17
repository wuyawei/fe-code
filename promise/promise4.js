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
        }
        return promise;
    };
    this.catch = function(onRejected){
        return this.then(null, onRejected);
    };
    if(promise.status === 'PENDING') {
        function transition (status, val) {
            setTimeout(_ => {
                promise.status = status;
                let st = status === 'FULFILLED';
                let queue  = promise[st ? 'resolves' : 'rejects'];

                promise[st ? 'value' : 'reason'] = val;
                queue.forEach(fn => {
                    promise[st ? 'value' : 'reason'] = fn(promise[st ? 'value' : 'reason']) || val;
                });
            });
        }
        function resolve(value){
            transition('FULFILLED', value);
        }
        function reject(reason){
            transition('REJECTED', reason);
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