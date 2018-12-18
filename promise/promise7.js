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
                console.log(this);
            });
        };

        function resolve(value) {
            transition('FULFILLED', value);
        }

        function reject(reason) {
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
        function success (value) {
            let val = typeof onFulfilled === 'function' ? onFulfilled(value) : value;
            resolve(val);
        }
        function erro (reason) {
            let rea = typeof onRejected === 'function' ? onRejected(reason) : reason;
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

let getInfor = new Promise((resolve, reject) => {
    setTimeout(_ => {
        let ran = Math.random();
        console.log(ran);
        if (ran > 0.5) {
            resolve('success');
        } else {
            reject('fail');
        }
    }, 200);
}).then(resolve => {
    console.log(resolve);
    return resolve + '111111';
}, reject => {
    console.log(reject);
    return 'erro';
}).then(resolve => {
    console.log(resolve);
}, reject => {
    console.log(reject);
});
