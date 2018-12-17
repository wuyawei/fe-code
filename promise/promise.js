/**
 * Created by wyw on 2018/12/17.
 */
function Promise(fn){

    let resolveCall;

    this.then = (onFulfilled) => {
        resolveCall = onFulfilled;
    };
    function resolve(v){
        callback(v);
    }
    fn(resolve);
}

new Promise((resolve, reject) => {
    setTimeout(_ => {
        resolve('success');
    }, 200)
}).then(r => {
    console.log(r);
});