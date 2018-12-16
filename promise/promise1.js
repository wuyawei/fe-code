function Promise(fn){

    var callback;

    this.then = function(done){
        callback = done;
    };
    setTimeout(_ => {
        function resolve(v){
            callback(v);
        }
        fn(resolve);
    });
}

new Promise((resolve, reject) => {
    setTimeout(_ => {
        resolve('success');
    }, 200)
}).then(r => {
    console.log(r);
});