/**
 * Created by wyw on 2018/12/17.
 */
function Promise(fn){
    this.resolves = [];

    this.then = (onFulfilled) => {
        this.resolves.push(onFulfilled);
        return this;
    };
    let resolve = (value) =>{
        setTimeout(_ => {
            this.resolves.forEach(fn => value = fn(value) || value);
        });
    };
    fn(resolve);
}

new Promise((resolve, reject) => {
    resolve('success');
}).then(r => {
    console.log(r);
    return r + ' ---> Vchat';
}).then(r => {
    console.log(r);
});