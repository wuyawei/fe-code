es6引入了[Symbol.iterator]属性，Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器，即iterator对象。同时提供了for...of循环，用来遍历任意具有iterator接口的数据结构。

遍历时会调用Iterator的next()方法，每次调用会返回一个有value和done属性的对象。value是当前成员的值，done表示遍历是否结束。这也是遍历器对象的根本特征。原生默认具有iterator接口的数据结构有Array、Map、Set、String、TypedArray、函数的 arguments 对象、NodeList 对象。对象是不具备iterator接口的，但是可以如下模拟：
``` javascript
    let obj = {
        [Symbol.iterator]() {
            return {
                next: function () {
                    return {
                        value: 'hahaha',
                        done: false
                    };
                }
            };
        }
    };
    for (let v of obj) {
        console.log(v) // 'hahaha'
    }
   // 这个例子将会无限循环下去，因为迭代器没有返回结束的信号
   
   let iterable = {
     0: 'a',
     1: 'b',
     2: 'c',
     length: 3,
     [Symbol.iterator]: Array.prototype[Symbol.iterator]
   };
   for (let v of iterable) {
     console.log(v); // 'a', 'b', 'c'
   }
   // 也可以直接绑定数组的迭代器，或者通过Array.from()将其转换为真正的数组
```
解构赋值、扩展运算、for...of、等方法都会默认调用迭代器接口。对象没有迭代器，但是依然可以进行扩展运算。