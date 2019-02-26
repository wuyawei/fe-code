### 异步遍历器（ES2018）
* 概述

  es2018引入了异步遍历器接口`Symbol.asyncIterator`。调用遍历器的next方法，返回的是一个 Promise 对象。
``` javascript
    asyncIterator
      .next()
      .then(
        ({ value, done }) => /* ... */
      );
```
* for await...of

  用于遍历异步的 Iterator 接口。
``` javascript
    async function f() {
      for await (let x of createAsyncIterable(['a', 'b'])) {
        console.log(x);
      }
    }
    // a b
```
### 异步 Generator 函数
异步Generator，自然返回一个异步遍历器。
``` javascript
    async function* gen() {
      yield 'hello';
    }
    const genObj = gen();
    genObj.next().then(x => console.log(x));
    // { value: 'hello', done: false }
```