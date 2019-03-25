/**
 * Created by wyw on 2018/12/17.
 */
function Promise(fn){
    this.resolves = [];
    this.status = 'PENDING';
    this.value;

    this.then = (onFulfilled) => {
        if (this.status === 'PENDING') {
            this.resolves.push(onFulfilled);
        } else if (this.status === 'FULFILLED') {
            console.log('isFULFILLED');
            onFulfilled(this.value);
        }
        return this;
    };
    let resolve = (value) =>{
        if (this.status === 'PENDING') {
            setTimeout(_ => {
                this.status = 'FULFILLED';
                this.resolves.forEach(fn => value = fn(value) || value);
                this.value = value;
            });
        }
    };
    fn(resolve);
}

let getInfor = new Promise((resolve, reject) => {
    resolve('success');
}).then(r => {
    console.log('hahah');
});
setTimeout(_ => {
    getInfor.then(r => {
        console.log(r);
    })
});

//现在我们在then方法中return的是他本身，这样一来所有的操作都是在一个Promise上，而Promise的状态又是不能随意转化的，所以都是以第一个Promise的状态为准