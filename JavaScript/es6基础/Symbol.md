### Symbol
* 介绍

  ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。是js的第七种数据类型。(undefined、null、布尔值、字符串、数值、对象)。
  
  Symbol 值通过Symbol函数生成。可以接受一个字符串参数，表示对symbol值的描述。如果参数是对象或者函数，会调用他们的toString方法进行类型转化。这里并不会调用valueOf方法。
``` javascript
    let obj = {
        toString() {
            return 'hello';
        },
        valueOf() {
            return 'haha';
        }
    };
    let fn = function () {};
    fn.toString = function () {
        return 'world';
    };
    fn.valueOf = function () {
        return 'nihao';
    };
    
    let s1 = Symbol(obj);
    let s2 = Symbol(fn);
    console.log(s1, s2); // Symbol(hello) Symbol(world)
```
   Symbol 值可以作为对象的属性名，这样可以保证不会出现同名的属性。
``` javascript
    let s1 = Symbol('name');
    let s2 = Symbol('name');
    let obj = {
        [s1]: 'zs',
        [s2]() {
            return 'ls';
        }
    };
    console.log(obj[s1], obj[s2]()); // zs ls  描述一样，但是值并不一样。
    
    console.log(obj.s1); // undefined
    obj.s1 = 'wyw';
    console.log(obj.s1, obj['s1']); // wyw  wyw
    //  .运算符后面都是指代字符串
```
* 遍历作为属性名的symbol

  for...in、for...of、Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()这些都不会返回symbol值，但是Object.getOwnPropertySymbols和Reflect.ownKeys可以。
``` javascript
    let s1 = Symbol('name');
    let s2 = Symbol('age');
    let obj = {
        [s1]: 'zs',
        [s2]() {
            return 18;
        },
        'say'() {
           return this.name;
        }
    };
    
    console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(name), Symbol(name) ]
    console.log(Reflect.ownKeys(obj)); // [ 'say', Symbol(name), Symbol(name) ]
    for (let k in obj) {
        console.log(k); // say
    }
```
* Symbol.for()，Symbol.keyFor()

  Symbol.for()和Symbol()都可以生成一个新的symbol值，但是前者会将生成的值登记在全局，所以在每次生成时会先查找有没有相同描述的值，如果有会直接返回，没有才会新建并登记。
  
  Symbol.keyFor() 则会返回一个已经登记过的symbol值的'key'，没有返回undefined。Symbol.for()没有传参数会默认以'undefined'为key值，所以他们都是同一个值。Symbol()定义的值因为没有登记，所以Symbol.keyFor()都查不到。
``` javascript
    let s1 = Symbol.for();
    let s2 = Symbol.for();
    let s3 = Symbol.for('undefined');
    let s4 = Symbol.for('name');
    let s5 = Symbol('name');
    console.log(s1 === s2, s2 === s3, s4 === s5, Symbol.keyFor(s1), Symbol.keyFor(s5));
    // true true false 'undefined' undefined
```
* 内置Symbol值
  * Symbol.hasInstance
    对象的`Symbol.hasInstance`属性，指向一个内部方法。当使用`instanceof`判断是否为该对象的实例时，会调用这个方法。比如，`zs instanceof Person`实际调用的就是`Person[Symbol.hasInstance](zs)`。
``` javascript
    class Person{
        static [Symbol.hasInstance](obj) { // static 才可以访问
            return true;
        }
    }
    console.log(1 instanceof Person); // true
```
  * Symbol.isConcatSpreadable
    Symbol.isConcatSpreadable属性是一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
    
    数组默认可以展开，Symbol.isConcatSpreadable默认是undefined，设置为true时，也可以展开。类数组的对象则默认不展开。只有Symbol.isConcatSpreadable属性设为true，才可以展开。
``` javascript
    let arr = [1,2,3];
    console.log(arr[Symbol.isConcatSpreadable]); // undefined
    arr[Symbol.isConcatSpreadable] = false;
    console.log(arr.concat([4,5])); // [[1,2,3],4,5]
```
  * Symbol.iterator
    指向对象的默认迭代器方法。
  * Symbol.toPrimitive
  
    对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。优先级高于toString方法。
    可以接受一个字符串参数。（在隐示转换时，会自动传入）。
    * Number：该场合需要转成数值
    * String：该场合需要转成字符串
    * Default：该场合可以转成数值，也可以转成字符串
``` javascript
    let handle = function(type) {
        switch (type) {
            case 'number':
                return 8;
            case 'string':
                return '好嗨哟';
            case 'default':
                return 'hello world';
            default:
                throw new Error();
        }
    };
    let obj = {
        [Symbol.toPrimitive] : handle,
        toString() {
            return 'String';
        }
    };
    let fn = function () {};
    fn.toString = function () {
        return 'oh nanana';
    };
    fn[Symbol.toPrimitive] = handle;
    console.log(obj * 2); // 16
    console.log(obj + '!!!'); // hello world!!!
    console.log(Number(obj)); // 8
    console.log(String(obj)); // 好嗨哟
    console.log(String(fn)); // 好嗨哟
```