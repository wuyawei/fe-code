/**
 * Created by wyw on 2018/12/16.
 */

function Promise(fn){

    var promise = this;
    promise.value;
    promise.reason;
    promise.status = 'PENDING';
    promise.resolves = [];
    promise.rejects = [];

    if(promise.status === 'PENDING') {
        function transition (status, val) {
            setTimeout(_ => {
                promise.status = status;
                let st = status === 'FULFILLED',
                    fn,
                    queue  = promise[st ? 'resolves' : 'rejects'];

                promise[st ? 'value' : 'reason'] = val;
                while(fn = queue.shift()) {
                    val = fn(val) || val;
                }
                promise[st ? 'value' : 'reason'] = val;
            });
        }
        function resolve(value){
            transition('FULFILLED', value);
        }
        function reject(reason){
            transition('REJECTED', reason);
        }
        fn(resolve, reject);
        // fn 运行结果触发resolve或者reject，从而运行then方法中传入的函数
    }
}

Promise.prototype.then = function(onFulfilled, onRejected){
    var promise = this;
    return new Promise(function (resolve, reject) {
        // 所有的then实例的promise都会添加这两个方法，如果得到的是函数就执行，不是函数则直接执行下一个then中的回调函数
        function success(value) {
            let ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
            if(ret && typeof ret['then'] === 'function'){
                ret.then(function(value){ // 如果返回的是Promise 则直接执行得到结果后再调用后面的then方法
                    resolve(value);
                },function(reason){
                    reject(reason);
                });
            }else{
                resolve(ret);
            }
        }
        function erro(reason) {
            reason = typeof onRejected === 'function' && onRejected(reason) || reason;
            reject(reason);
        }

        if (promise.status === 'PENDING') {
            promise.resolves.push(success);
            promise.rejects.push(erro);
        }else if(promise.status === 'FULFILLED'){ // 状态改变后的then操作，立刻执行
            console.log('promise.status', promise.status);
            success(promise.value);
        }else if(promise.status === 'REJECTED'){
            erro(promise.reason);
        }
    });
};

Promise.prototype.catch = function(onRejected){
    return this.then(null, onRejected)
};

let getCatch = new Promise((resolve, reject) => {
    reject('reject--->');
});

let getInfo = () => {
    return new Promise((resolve, reject) => {
        setTimeout(_ => {
            let ran = Math.random();
            console.log(ran);
            if (ran > 0.5) {
                resolve('success');
            } else {
                reject('fail');
            }
        }, 200);
    });
};
setTimeout(_ => {
    getInfo().then(r => {
        console.log(r);
        return r + '----> Vchat';
    }).then(r => {
        console.log(r);
    }).catch(err => {
        console.log(err);
    });
}, 2000);