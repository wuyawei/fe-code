/**
 * Created by wyw on 2018/12/17.
 */
function Promise(Fn){
    this.value;
    this.reason;
    this.resolves = [];
    this.rejects = [];
    this.status = 'PENDING';

    this.then = (onFulfilled, onRejected) => {
        function success (value) {
            return typeof onFulfilled === 'function' && onFulfilled(value) || value;
        }
        function erro (reason) {
            return typeof onRejected === 'function' && onRejected(reason) || reason;
        }

        if (this.status === 'PENDING') {
            this.resolves.push(success);
            this.rejects.push(erro);
        } else if (this.status === 'FULFILLED') {
            success(this.value);
        } else if (this.status === 'REJECTED') {
            erro(this.reason);
        }
        return this;
    };

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
