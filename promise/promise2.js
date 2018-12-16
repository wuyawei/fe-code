function Promise(fn){

    var callback;

    this.then = function(done){
        callback = done;
    };
    setTimeout(_ => {
        function resolve(v){
            callback(v);
        }
        function reject(v){
            callback(v);
        }
        fn(resolve, reject);
    });
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
}).then(r => {
    console.log(r);
});