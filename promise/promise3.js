/**
 * Created by wyw on 2018/12/16.
 */

var PENDING = 0, FULFILLED = 1, REJECTED = 2;
var isFunction = function(obj){
    return 'function' === typeof obj;
};
function Promise(fn){

    var resolveCall, rejectCall, promise = this;
    promise.status = PENDING;

    this.then = function(onFulfilled, onRejected){
        void(isFunction(onFulfilled) ? resolveCall = onFulfilled :null);
        void(isFunction(onRejected) ? rejectCall = onRejected :null);
        return promise;
    };
    this.catch = function(onRejected){
        return this.then(null, onRejected);
    };
    if(promise.status === PENDING) {
        setTimeout(_ => {
            function resolve(v){
                promise.status = FULFILLED;
                resolveCall(v);
            }
            function reject(v){
                promise.status = REJECTED;
                rejectCall(v);
            }
            fn(resolve, reject);
        });
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
}).catch(err => {
    console.log('err', err);
});