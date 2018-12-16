/**
 * Created by wyw on 2018/12/16.
 */
//完整版，代码后面附有实例，方便检验

// resolve 和 reject 最终都会调用该函数
var final = function(status,value){
    var promise = this, fn, st;

    if(promise._status !== 'PENDING') return;

    // 所以的执行都是异步调用，保证then是先执行的
    setTimeout(function(){
        promise._status = status;
        st = promise._status === 'FULFILLED'
        queue = promise[st ? '_resolves' : '_rejects'];
        console.log(promise);
        while(fn = queue.shift()) {
            value = fn.call(promise, value) || value;
        }

        promise[st ? '_value' : '_reason'] = value;
        promise['_resolves'] = promise['_rejects'] = undefined;
    });
}


//参数是一个函数，内部提供两个函数作为该函数的参数,分别是resolve 和 reject
var Promise = function(resolver){
    if (!(typeof resolver === 'function' ))
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    //如果不是promise实例，就new一个
    if(!(this instanceof Promise)) return new Promise(resolver);

    var promise = this;
    promise._value;
    promise._reason;
    promise._status = 'PENDING';
    //存储状态
    promise._resolves = [];
    promise._rejects = [];

    //
    var resolve = function(value) {
        //由於apply參數是數組
        final.apply(promise,['FULFILLED'].concat([value]));
    }

    var reject = function(reason){
        final.apply(promise,['REJECTED'].concat([reason]));
    }

    resolver(resolve,reject);
}

Promise.prototype.then = function(onFulfilled,onRejected){
    var promise = this;
    // 每次返回一个promise，保证是可thenable的
    return new Promise(function(resolve,reject){

        function handle(value) {
            // 這一步很關鍵，只有這樣才可以將值傳遞給下一個resolve
            var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;

            //判断是不是promise 对象
            if (ret && typeof ret ['then'] == 'function') {
                ret.then(function(value) {
                    resolve(value);
                }, function(reason) {
                    reject(reason);
                });
            } else {
                resolve(ret);
            }
        }

        function errback(reason){
            reason = typeof onRejected === 'function' && onRejected(reason) || reason;
            reject(reason);
        }

        if(promise._status === 'PENDING'){
            promise._resolves.push(handle);
            promise._rejects.push(errback);
        }else if(promise._status === FULFILLED){ // 状态改变后的then操作，立刻执行
            callback(promise._value);
        }else if(promise._status === REJECTED){
            errback(promise._reason);
        }
    });
}

Promise.prototype.catch = function(onRejected){
    return this.then(undefined, onRejected)
}

Promise.prototype.delay = function(ms,value){
    return this.then(function(ori){
        return Promise.delay(ms,value || ori);
    })
}

Promise.delay = function(ms,value){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve(value);
            console.log('1');
        },ms);
    })
}

Promise.resolve = function(arg){
    return new Promise(function(resolve,reject){
        resolve(arg)
    })
}

Promise.reject = function(arg){
    return Promise(function(resolve,reject){
        reject(arg)
    })
}

Promise.all = function(promises){
    if (!Array.isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
    }
    return Promise(function(resolve,reject){
        var i = 0,
            result = [],
            len = promises.length,
            count = len

        //这里与race中的函数相比，多了一层嵌套，要传入index
        function resolver(index) {
            return function(value) {
                resolveAll(index, value);
            };
        }

        function rejecter(reason){
            reject(reason);
        }

        function resolveAll(index,value){
            result[index] = value;
            if( --count == 0){
                resolve(result)
            }
        }

        for (; i < len; i++) {
            promises[i].then(resolver(i),rejecter);
        }
    });
}

Promise.race = function(promises){
    if (!Array.isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
    }
    return Promise(function(resolve,reject){
        var i = 0,
            len = promises.length;

        function resolver(value) {
            resolve(value);
        }

        function rejecter(reason){
            reject(reason);
        }

        for (; i < len; i++) {
            promises[i].then(resolver,rejecter);
        }
    });
}

/**********************************************************************/
//实例
var getData100 = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('100ms');
        },1000);
    });
}

var getData200 = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('200ms');
        },2000);
    });
}
var getData300 = function(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            reject('reject');
        },3000);
    });
}

// getData100().then(function(data){
//     console.log(data); // 100ms
//     return getData200();
// }).then(function(data){
//     console.log(data); // 200ms
//     return getData300();
// }).then(function(data){
//     console.log(data); // 100ms
// }, function(data){
//     console.log(data);
// });

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

// Promise.all([getData100(), getData200()]).then(function(data){
//     console.log(data); // 100ms
// });
//
// Promise.race([getData100(), getData200(), getData300()]).then(function(data){
//     console.log(data); // 100ms
// });