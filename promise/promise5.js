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
    let resolve = (value) =>{
        if (this.status === 'PENDING') {
            setTimeout(_ => {
                this.status = 'FULFILLED';
                this.resolves.forEach(fn => value = fn(value) || value);
                this.reason = value;
            });
        }
    };
    let reject = (reason) =>{
        if (this.status === 'PENDING') {
            setTimeout(_ => {
                this.status = 'REJECTED';
                this.rejects.forEach(fn => reason = fn(reason) || reason);
                this.reason = reason;
            });
        }
    };
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
    return 0;
}, reject => {
    console.log(reject);
    return 'erro';
}).then(resolve => {
    console.log(resolve);
}, reject => {
    console.log(reject);
});