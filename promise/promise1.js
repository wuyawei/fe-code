function Promise(fn){
    //需要一个成功时的回调
    var callback;
    //一个实例的方法，用来注册异步事件
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