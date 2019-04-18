### 言归正传，你经历过绝望吗？

![](https://user-gold-cdn.xitu.io/2018/12/18/167c123d42eb074a?w=240&h=240&f=jpeg&s=8404)
> 众所周知，js是单线程异步机制的。这样就会导致很多异步处理会嵌套很多的回调函数，最为常见的就是ajax请求，我们需要等请求结果返回后再进行某些操作。如：

```javascript
    function success(data, status) {
        console.log(data)
    }
    function fail(err, status) {
        console.log(err)
    }
    ajax({
        url: myUrl,
        type: 'get',
        dataType: 'json',
        timeout: 1000,
        success: success(data, status),
        fail: fail(err, status)
    })
```
> 乍一看还行啊，不够绝望啊，让绝望来的更猛烈一些吧！那么试想一下，如果还有多个请求依赖于上一个请求的返回值呢？五个？六个？代码就会变得非常冗余和不易维护。这种现象，我们一般亲切地称它为‘回调地狱’。现在解决回调地狱的手段有很多，比如非常方便的async/await、Promise等。

> 我们现在要讲的是Promise。在如今的前端面试中，Promise简直是考点般的存在啊，十个有九个会问。那么我们如何真正的弄懂Promise呢？俗话说的好，‘想要了解它，先要接近它，再慢慢地实现它’。自己实现一个Promise，不就什么都懂了。

![](https://user-gold-cdn.xitu.io/2018/12/18/167c135462fe16d8?w=300&h=300&f=gif&s=55311)

>其实网络上关于Promise的文章有很多，我也查阅了一些相关文章，文末有给出相关原文链接。所以本文侧重点是我在实现Promise过程中的思路以及个人的一些理解，有感兴趣的小伙伴可以一起交流。

如果用promise实现上面的ajax，大概是这个效果：
```javascript
    ajax().success().fail();
```
## 何为 Promise
> 那么什么是Promise呢？
1. Promise是为了解决异步编程的弊端，使你的代码更有条理、更清晰、更易维护。
2. Promise是一个构造函数（或者类），接受一个函数作为参数，该函数接受resolve，reject两个参数。
3. 它的内部有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败），其中pending可以转化为fulfilled或者和rejected，但是不能逆向转化，成功和失败也不能相互转化。
4. value、reason成功的参数和失败的错误信息。
5. then方法，实现链式调用，类似于jq。

基本用法：
```javascript
    let getInfo = new Promise((resolve, reject) => {
        setTimeout(_ => {
            let ran = Math.random();
            console.log(ran);
            if (ran > 0.5) {
                resolve('success');
            } else {
                reject('fail');
            }
        }, 200);
    });
    getInfo.then(r => {
        return r + ' ----> Vchat';
    }).then(r => {
        console.log(r);
    }).catch(err => {
        console.log(err);
    })
    // ran > 0.5输出 success ----> Vchat
    // ran <= 0.5输出 fail
```
先定个小目标，然后一步步实现它。
## 构建Promise
* 基础构造
    > 首先需要了解一下基本原理。我第一次接触Promise的时候，还很懵懂（捂脸）。那会只知道这么写，不知道到底是个什么流程走向。下面，我们来看看最基本的实现：

    ```javascript
        function Promise(Fn){
            let resolveCall = function() {console.log('我是默认的');}; // 定义为函数是为了防止没有then方法时报错
            this.then = (onFulfilled) => {
                resolveCall = onFulfilled;
            };
            function resolve(v){ // 将resolve的参数传给then中的回调
                resolveCall(v);
            }
            Fn(resolve);
        }
        new Promise((resolve, reject) => {
            setTimeout(_ => {
                resolve('success');
            }, 200)
        }).then(r => {
            console.log(r);
        });
        // success
    ```
    这里需要注意的是，当我们new Promise 的时候Promise里的函数会直接执行。所以如果你想定义一个Promise以待后用，比如axios封装，需要用函数包装。比如这样：
    ```javascript
        function myPromise() {
            return new Promise((resolve, reject) => {
                setTimeout(_ => {
                    resolve('success');
                }, 200)
            })
        }
        // myPromise().then()
    ```
    再回到上面，在new Promise 的时候会立即执行fn，遇到异步方法，于是先执行then中的方法，将 onFulfilled 存储到 resolveCall 中。异步时间到了后，执行 resolve，从而执行 resolveCall即储存的then方法。这是输出的是我们传入的‘success’
    > 这里会有一个问题，如果 Promise 接受的方法不是异步的，则会导致 resolve 比 then 方法先执行。而此时 resolveCall 还没有被赋值，得不到我们想要的结果。所以要给resolve加上异步操作，从而保证then方法先执行。
    
    ```javascript
        // 直接resolve
        new Promise((resolve, reject) => {
            resolve('success');
        }).then(r => {
            console.log(r); // 输出为 ‘我是默认的’，因为此时then方法还没有，then方法的回调没有赋值给resolveCall，执行的是默认定义的function() {}。
        });
        // 加上异步处理，保证then方法先执行
        function resolve(v){
            setTimeout(_ => {
                resolveCall(v);
            })
        }
    ```
* 增加链式调用
    > 链式调用是Promise非常重要的一个特征，但是上面写的那个函数显然是不支持链式调用的，所以我们需要进行处理，在每一个then方法中return一下this。

    ```javascript
        function Promise(Fn){
            this.resolves = []; // 方便存储onFulfilled
            this.then = (onFulfilled) => {
                this.resolves.push(onFulfilled);
                return this;
            };
            let resolve = (value) =>{ // 改用箭头函数，这样不用担心this指针问题
                setTimeout(_ => {
                    this.resolves.forEach(fn => fn(value));
                });
            };
            Fn(resolve);
        }
    ```
    可以看到，这里将接收then回调的方法改为了Promise的属性resolves，而且是数组。这是因为如果有多个then，依次push到数组的方式才能存储，否则后面的then会将之前保存的覆盖掉。这样等到resolve被调用的时候，依次执行resolves中的函数就可以了。这样可以进行简单的链式调用。
    ```javascript
        new Promise((resolve, reject) => {
            resolve('success');
        }).then(r => {
            console.log(r); // success
        }).then(r => {
            console.log(r); // success
        });
    ```
    但是我们会有这样的需求, 某一个then链想自己return一个参数供后面的then使用，如：
    ```javascript
        then(r => {
            console.log(r);
            return r + ' ---> Vchat';
        }).then();
    ```
    要做到这一步，需要再加一个处理。
    ```javascript
        let resolve = (value) =>{
            setTimeout(_ => {
                // 每次执行then的回调时判断一下是否有返回值，有的话更新value
                this.resolves.forEach(fn => value = fn(value) || value);
            });
        };
    ```
* 增加状态
    > 我们在文章开始说了Promise的三种状态以及成功和失败的参数，现在我们需要体现在自己写的实例里面。

    ```javascript
        function Promise(Fn){
            this.resolves = [];
            this.status = 'PENDING'; // 初始为'PENDING'状态
            this.value;
            this.then = (onFulfilled) => {
                if (this.status === 'PENDING') { // 如果是'PENDING'，则储存到数组中
                    this.resolves.push(onFulfilled);
                } else if (this.status === 'FULFILLED') { // 如果是'FULFILLED'，则立即执行回调
                    console.log('isFULFILLED');
                    onFulfilled(this.value);
                }
                return this;
            };
            let resolve = (value) =>{
                if (this.status === 'PENDING') { // 'PENDING' 状态才执行resolve操作
                    setTimeout(_ => {
                        //状态转换为FULFILLED
                        //执行then时保存到resolves里的回调
                        //如果回调有返回值，更新当前value
                        this.status = 'FULFILLED';
                        this.resolves.forEach(fn => value = fn(value) || value);
                        // 这里有一个问题 实际上Promise 并没有判断是否有fanhui返回值
                        // fn => value = fn(value)，没有返回值就是 undefined 
                        this.value = value;
                    });
                }
            };
            Fn(resolve);
        }
    ```
    这里可能会有同学觉得困惑，我们通过一个例子来说明增加的这些处理到底有什么用。
    ```javascript
        let getInfo = new Promise((resolve, reject) => {
            resolve('success');
        }).then(_ => {
            console.log('hahah');
        });
        setTimeout(_ => { 
            getInfo.then(r => {
                console.log(r); // success
            })
        }, 200);
    ```
    在resolve函数中，判断了'PENDING' 状态才执行setTimeout方法，并且在执行时更改了状态为'FULFILLED'。这时，如果运行这个例子，只会输出一个‘hahah’，因为接下来的异步方法调用时状态已经被改为‘FULFILLED’，所以不会再次执行。
    
    这种情况要想它可以执行，就需要用到then方法里的判断，如果状态是'FULFILLED'，则立即执行回调。此时的传参是在resolve执行时保存的this.value。这样就符合Promise的状态原则，PENDING不可逆，FULFILLED和REJECTED不能相互转化。
* 增加失败处理

    >可能有同学发现我一直没有处理reject，不用着急。reject和resolve流程是一样的，需要一个reason做为失败的信息返回。在链式调用中，只要有一处出现了reject，后续的resolve都不应该执行，而是直接返回reject。
    ```javascript
        this.reason;
        this.rejects = [];
         // 接收失败的onRejected函数
        if (this.status === 'PENDING') {
            this.rejects.push(onRejected);
        }
         // 如果状态是'REJECTED'，则立即执行onRejected。
        if (this.status === 'REJECTED') {
            onRejected(this.reason);
        }
        // reject方法
        let reject = (reason) =>{
            if (this.status === 'PENDING') {
                setTimeout(_ => {
                    //状态转换为REJECTED
                    //执行then时保存到rejects里的回调
                    //如果回调有返回值，更新当前reason
                    this.status = 'REJECTED';
                    this.rejects.forEach(fn => reason = fn(reason) || reason);
                    this.reason = reason;
                });
            }
        };
        // 执行Fn出错直接reject
        try {
            Fn(resolve, reject);
        }
        catch(err) {
            reject(err);
        }
    ```
    在执行储存then中的回调函数那一步有一个细节一直没有处理，那就是判断是否有onFulfilled或者onRejected方法，因为是允许不要其中一个的。现在如果then中缺少某个回调，会直接push进undefined，如果执行的话就会出错，所以要先判断一下是否是函数。
    ```javascript
        this.then = (onFulfilled, onRejected) => {
            // 判断是否是函数，是函数则执行
            function success (value) {
                return typeof onFulfilled === 'function' && onFulfilled(value) || value;
            }
            function erro (reason) {
                return typeof onRejected === 'function' && onRejected(reason) || reason;
            }
            // 下面的处理也要换成新定义的函数
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
    ```
    因为reject回调执行时和resolve基本一样，所以稍微优化一下部分代码。
    ```javascript
        if(this.status === 'PENDING') {
            let transition = (status, val) => {
                setTimeout(_ => {
                    this.status = status;
                    let f = status === 'FULFILLED',
                        queue = this[f ? 'resolves' : 'rejects'];
                    queue.forEach(fn => val = fn(val) || val);
                    this[f ? 'value' : 'reason'] = val;
                });
            };
            function resolve(value) {
                transition('FULFILLED', value);
            }
            function reject(reason) {
                transition('REJECTED', reason);
            }
        }
    ```
* 串行 Promise
    > 假设有多个ajax请求串联调用，即下一个需要上一个的返回值作为参数，并且要return一个新的Promise捕捉错误。这样我们现在的写法就不能实现了。

    >我的理解是之前的then返回的一直是this，但是如果某一个then方法出错了，就无法跳出循环、抛出异常。而且原则上一个Promise，只要状态改变成‘FULFILLED’或者‘REJECTED’就不允许再次改变。
    
    >之前的例子可以执行是因为没有在then中做异常的处理，即没有reject，只是传递了数据。所以如果要做到每一步都可以独立的抛出异常，从而终止后面的方法执行，还需要再次改造，我们需要每个then方法中return一个新的Promise。
    ```javascript
        // 把then方法放到原型上，这样在new一个新的Promise时会去引用prototype的then方法，而不是再复制一份。
        Promise.prototype.then = function(onFulfilled, onRejected) {
            let promise = this;
            return new Promise((resolve, reject) => {
                function success (value) {
                    let val = typeof onFulfilled === 'function' && onFulfilled(value) || value;
                    resolve(val); // 执行完这个then方法的onFulfilled以后，resolve下一个then方法
                }
                function erro (reason) {
                    let rea = typeof onRejected === 'function' && onRejected(reason) || reason;
                    reject(rea); // 同resolve
                }
                if (promise.status === 'PENDING') {
                    promise.resolves.push(success);
                    promise.rejects.push(erro);
                } else if (promise.status === 'FULFILLED') {
                    success(promise.value);
                } else if (promise.status === 'REJECTED') {
                    erro(promise.reason);
                }
            });
        };
    ```
    在成功的函数中还需要做一个处理，用以支持在then的回调函数（onFulfilled）中return的Promise。如果onFulfilled方法return的是一个Promise，则直接执行它的then方法。如果成功了，就继续执行后面的then链，失败了直接调用reject。
    ```javascript
        function success(value) {
            let val = typeof onFulfilled === 'function' && onFulfilled(value) || value;
            if(val && typeof val['then'] === 'function'){ // 判断是否有then方法
                val.then(function(value){ // 如果返回的是Promise 则直接执行得到结果后再调用后面的then方法
                    resolve(value);
                },function(reason){
                    reject(reason);
                });
            }else{
                resolve(val);
            }
        }
    ```
    找个例子测试一下
    ```javascript
        function getInfo(success, fail) {
            return new Promise((resolve, reject) => {
                setTimeout(_ => {
                    let ran = Math.random();
                    console.log(success, ran);
                    if (ran > 0.5) {
                        resolve(success);
                    } else {
                        reject(fail);
                    }
                }, 200);
            })
        }
        getInfo('Vchat', 'fail').then(res => {
            console.log(res);
            return getInfo('可以线上预览了', 'erro');
        }, rej => {
            console.log(rej);
        }).then(res => {
            console.log(res);
        }, rej => {
            console.log(rej);
        });
        // 输出
        // Vchat 0.8914818954810422
        // Vchat
        // 可以线上预览了 0.03702367800412443
        // erro
    ```
## 总结
> 到这里，Promise的主要功能基本上都实现了。还有很多实用的扩展，我们也可以添加。
比如 catch可以看做then的一个语法糖，只有onRejected回调的then方法。其它Promise的方法，比如.all、.race 等等，感兴趣的小伙伴可以自己实现一下。另外，文中如有不对之处，还请指出。
    
```javascript
    Promise.prototype.catch = function(onRejected){
        return this.then(null, onRejected);
    }
```

## 相关文章
* [手把手教你实现一个完整的 Promise](http://www.cnblogs.com/huansky/p/6064402.html)
* [教你一步一步实现一个Promise - 飞魚](https://www.tuicool.com/articles/RzQRV3)
* [阮一峰老师的es6-Promise章节](http://es6.ruanyifeng.com/#docs/promise)
  
## 交流群
> qq前端交流群：960807765，欢迎各种技术交流，期待你的加入

## 公众号
  欢迎关注公众号 **前端发动机**，江三疯的前端二三事，专注技术，也会时常迷糊。希望在未来的前端路上，与你一同成长。
  ![](https://user-gold-cdn.xitu.io/2019/3/16/1698668bd914d63f?w=258&h=258&f=jpeg&s=27979)