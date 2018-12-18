/**
 * Created by wyw on 2018/12/16.
 */
function Person(name){
    this.name=name;
}

Person.prototype.share=[];

Person.prototype.printName=function(callback){
    callback();
};

let zhangsan = new Person('zhangsan');
zhangsan.printName(_ => {
    console.log(zhangsan.name);
});

function Promise(fn){
    let promise = this;
    promise.status = 'PENDING'; // 初始为'PENDING'状态
    promise.value; // 成功的返回
    promise.reason; // 失败的错误处理
    promise.resolves = []; // 接收onFulfilled
    promise.rejects = []; // 接收onRejected

    this.then = function(onFulfilled, onRejected){
        // then方法接收两个回调，一个成功的处理，一个失败的处理
    };
    let resolve = (value) => {
        //状态转换为FULFILLED
        //执行then时保存到resolves里的回调
        //如果回调有返回值，更新当前value
    }
    let reject = (reason) => {
        //状态转换为REJECTED
        //执行then时保存到rejects里的回调
        //如果回调有返回值，更新当前reason
    }
    fn(resolve, reject);
}