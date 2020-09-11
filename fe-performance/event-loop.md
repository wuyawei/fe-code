## Event Loop
### 介绍
JavaScript 之所以被设计为单线程，是因为作为一门脚本语言，使用多线程会使浏览器变得非常复杂。比如，当一个线程正在修改一个 dom 元素的样式时，另一个线程将其删除。这样，浏览器就无法判断该怎么去执行。
Javascript 有一个 main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。
Event Loop是一个程序结构，用于等待和发送消息及事件。在JavaScript中，任务被分为MacroTask（宏任务）和MicroTask（微任务）两种。
* MacroTask: script(整体代码), setTimeout, setInterval, setImmediate（node、IE10）, I/O, UI rendering
* MicroTask: process.nextTick（node）, Promises, Object.observe(废弃), MutationObserver

一次事件循环：先执行 macroTask 的所有同步任务，执行栈清空后，查看有没有 microTask，有的话一次性执行所有的微任务，接着开始下一次循环。
### 运行顺序
运行 script（MacroTask）时，会先执行内部所有的同步任务，执行完后开始检查 MicroTask 。如果有 process.nextTick 会插入执行栈最后（优先于其他 MicroTask），如果有 setImmediate 则会滞后于其他 MicroTask。

Node的Event Loop分阶段，阶段有先后，依次是

* expired timers and intervals，即到期的setTimeout/setInterval
* I/O events，包含文件，网络等等
* immediates，通过setImmediate注册的函数
* close handlers，close事件的回调，比如TCP连接断开

同步任务及每个阶段之后都会清空microtask队列

优先清空next tick queue，即通过process.nextTick注册的函数
再清空other queue，常见的如Promise

``` javascript
console.log(1)

setTimeout(() => { // MacroTask
  console.log(2)
}, 0)

Promise.resolve().then(() => {  // MicroTask
	console.log(3)
}).then(() => {
	console.log(4)
})

console.log(5)

// 1、5、3、4、2

console.log(1)

setTimeout(() => {
    console.log(2)
    new Promise(resolve => {
        console.log(4)
        resolve()
    }).then(() => {
        console.log(5)
    })
    process.nextTick(() => {
        console.log(3)
    })
})

new Promise(resolve => {
    console.log(7)
    resolve()
}).then(() => {
    console.log(8)
})

process.nextTick(() => {
    console.log(6)
})
// 1、7、6、8、2、4、3、5

setTimeout(function() {
    console.log('setTimeout');
}, 3000)

new Promise(function(resolve) {
    setTimeout(function() {
        console.log('promise');
        resolve()
    }, 2000)
}).then(function() {
    console.log('then');
})

console.time()
for (let i = 0; i < 20000; i++) {
    setTimeout(function() {
        console.log('for');
    }, 3000)
    // console.log('for');
}
console.timeEnd()
console.log('console');
// 执行完所有同步任务，观察有没有微任务，没有再进行下一个宏任务（setTimeout的计时是同时进行的，但是就算时间到了，也一定要执行栈清空以后才会运行。而且，被阻塞后，就算所有的计时器都到时间了，依然会按照定时器到点的先后顺序进行执行）。
```
## setTimeout
浏览器页面是由消息队列和事件循环系统来驱动的。
*  如果当前同步任务执行时间过久，会影延迟到期定时器任务的执行
*  如果 setTimeout 存在嵌套调用，那么系统会设置最短时间间隔为 4 毫秒
*  未激活的页面，setTimeout 执行最小间隔是 1000 毫秒。为了优化后台页面的加载损耗以及降低耗电量。
*  延时执行时间有最大值，不能大于 2147483647 毫秒（大约 24.8 天）。
