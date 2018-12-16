/**
 * Created by wyw on 2018/12/16.
 */

var PENDING = 0, FULFILLED = 1, REJECTED = 2;
var isFunction = function(obj){
    return 'function' === typeof obj;
};
function Promise(fn){

    var promise = this;
    promise.value;
    promise.reason;
    promise.status = PENDING;
    promise.resolves = [];
    promise.rejects = [];

    if(promise.status === PENDING) {
        function resolve(v){
            promise.status = FULFILLED;
            setTimeout(_ => {
                var queue = promise.resolves;
                var fn;
                while(fn = queue.shift()) {
                    v = fn(v) || v;
                }
                promise.value = v;
            });
        }
        function reject(s){
            promise.status = REJECTED;
            setTimeout(_ => {
                var queue = promise.rejects;
                var fn;
                while(fn = queue.shift()) {
                    s = fn(s) || s;
                }
                promise.reason = s;
            });
        }
        fn(resolve, reject);
    }
}

Promise.prototype.then = function(onFulfilled, onRejected){
    var promise = this;
    return new Promise(function (resolve, reject) {
        // 所有的then实例的promise都会添加这两个方法，如果得到的是函数就执行，不是函数则执行下一个then中的回调函数
        function success(value) {
            var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
            resolve(ret);
        }
        function erro(reason) {
            reason = typeof onRejected === 'function' && onRejected(reason) || reason;
            console.log(onRejected, reason);
            reject(reason);
        }

        if (promise.status === PENDING) {
            promise.resolves.push(success);
            promise.rejects.push(erro);
        }else if(promise.status === FULFILLED){ // 状态改变后的then操作，立刻执行
            success(promise.value);
        }else if(promise.status === REJECTED){
            erro(promise.reason);
        }
    });
};

Promise.prototype.catch = function(onRejected){
    return this.then(null, onRejected)
};

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
    return 'Vchat';
}).then(data => {
    return data + '已经';
}).catch(err => {
    console.log(err + 'oh 下线了');
}).then(data => {
    return data + '上线了';
}).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err + 'oh 下线了');
});