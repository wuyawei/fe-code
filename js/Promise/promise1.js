/**
 * Created by wyw on 2018/12/17.
 */
function Promise(fn){

    let resolveCall = function() {console.log('我是默认的');};

    this.then = (onFulfilled) => {
        resolveCall = onFulfilled;
    };
    function resolve(v){
        resolveCall(v);
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