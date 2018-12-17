function Promise(fn){

    let resolveCall, rejectCall;

    this.then = (resolve, reject) => {
        resolveCall = reject;
        rejectCall = resolve;
    };
    function resolve(v){
        setTimeout(_ => {
            resolveCall(v);
        });
    }
    function reject(v){
        setTimeout(_ => {
            rejectCall(v);
        });
    }

    fn(resolve, reject);
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
}).then(resolve => {
    console.log(resolve);
},reject => {
    console.log(reject);
});