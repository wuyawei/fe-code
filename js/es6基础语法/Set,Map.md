> 参考自阮一峰（es6入门）
### set
* 概述
  
  es6新增数据结构，类似于数组，但是所有的值都是唯一的。所以可以利用set给数组去重。set可以通过add(返回的是set 结构，所以可以连续调用)来增加成员，也可以通过接受一个数组（或其他具有迭代器接口的数据结构）来进行初始化。
``` javascript
    let s = new Set();
    s.add(2).add(3).add(2);
    let s1 = new Set([1,1,2,2,3]);
    let obj = {
        [Symbol.iterator]() {
            let index = 0;
            return {
                next: function () {
                    if (index < 3) {
                        return {
                            value: index++,
                            done: false
                        };
                    }
                    return {
                        value: 'undefined',
                        done: true
                    };
                }
            };
        }
    };
    let s2 = new Set(obj);
    console.log(s); // Set { 2, 3 }
    console.log(s1); // Set { 1, 2, 3 }
    console.log(s2); // Set { 0, 1, 2 }
    
    console.log([...new Set([1,,1,2,2,3])])  // [1,2,3] 数组去重
    console.log(Array.from(new Set([1,,1,2,2,3]))); // [1,2,3] 数组去重
    console.log([...new Set('ababbc')].join('')); // ['a', 'b', 'c']  去除字符串的重复字符
```
   在Set内部，两个NaN是相等的（'==='运算符两个NaN不相等），两个对象总是不相等的。
``` javascript
    let s = new Set();
    s.add(NaN).add(NaN).add({}).add({});
    console.log(s); // Set { NaN, {}, {} }
```
* set的属性和方法
  属性
  * Set.prototype.constructor：构造函数，默认就是Set函数。
  * Set.prototype.size：返回Set实例的成员总数。
  操作方法
  * add(value)：添加某个值，返回 Set 结构本身。
  * delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
  * has(value)：返回一个布尔值，表示该值是否为Set的成员。
  * clear()：清除所有成员，没有返回值。
  遍历方法
  * keys()：返回键名的遍历器。
  * values()：返回键值的遍历器。
  * entries()：返回键值对的遍历器。
  * forEach()：使用回调函数遍历每个成员。
  
``` javascript
    let s = new Set();
    s.add(1).add(3).add(5);
    console.log(s, s.size);
    s.delete(3);
    console.log(s.has(3), s);
    for (let v of s.keys()) {
        console.log(v); // 1, 5
    }
    for (let v of s.values()) {
        console.log(v); // 1, 5
    }
    for (let v of s.entries()) {
        console.log(v);  // [ 1, 1 ]  [ 5, 5 ]
    }
    
    // 因为set的遍历器生成函数就是它的values方法，Set.prototype[Symbol.iterator] === Set.prototype.values
    // 所以values方法等同于
    for (let v of s) {
        console.log(v); // 1, 5
    }
    //
    s.forEach((v, k) => console.log(k + '=>' + v)); // 1=>1 5=>5
    // 结合filter实现取两个set的交集
    console.log(new Set([...s].filter(x => new Set([1]).has(x)))); // Set { 1 }
```
### WeakSet
* 概述
  WeakSet 结构与Set类似，也是不重复的值的集合。它与 Set 有两个区别。第一，WeakSet 的成员只能是对象，而不能是其他类型的值。第二，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
  
 垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。而WeakSet里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。所以只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。
 
 由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

* 属性和方法
  * WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
  * WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
  * WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
### Map
* 概述
  类似于对象，也是键值对的集合，但是键的范围不限于字符串，各种类型的值（包括对象）都可以当作键。Map构造函数接受数组作为参数，数组成员是一个表示键值对的数组。（任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构，都可以当做map构造函数的参数。比如set和map自身）
``` javascript
    let arr = [
      ['name', 'lisi'],
      ['age', 18]
    ];
    let map = new Map(arr);
    // 等价于
    let map = new Map();
    arr.forEach(
      ([key, value]) => map.set(key, value);
    );
```
* 属性和方法
  * size 返回成员总数
  * set(key, value) 设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
  * get(key) 读取key对应的键值，如果找不到key，返回undefined。
  * has(key) has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
  * delete(key) 删除某个键，返回true。如果删除失败，返回false。
  * clear() 清除所有成员，没有返回值。
  遍历方法（Map 的遍历顺序就是插入顺序。）
  * keys()：返回键名的遍历器。
  * values()：返回键值的遍历器。
  * entries()：返回所有成员的遍历器。
  * forEach()：遍历 Map 的所有成员。
  map结构的for...of遍历方法默认是entries(), 即map[Symbol.iterator] === map.entries；
### WeakMap
* 概述
  WeakMap结构与Map结构类似，也是用于生成键值对的集合。WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。WeakMap的键名所指向的对象，不计入垃圾回收机制。*WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。*
* 方法
  get()、set()、has()、delete()。