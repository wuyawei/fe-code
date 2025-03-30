## JavaScript 核心：从基础到现代特性与函数式思想

JavaScript (JS) 是 Web 开发的基石，赋予网页动态交互能力。它是一门多范式、动态类型的脚本语言。深入理解其核心概念、掌握 ES6 以来的现代特性，并吸收函数式编程的思想，对于编写高效、可维护、可扩展的前端代码至关重要。

### 3.1 语言基础

#### 3.1.1 数据类型 (Data Types)

JavaScript 的数据类型分为两大类：

1.  **原始类型 (Primitive Types)**: 值本身不可变，存储在栈内存中。
    -   `string`: 文本字符串 (如 `"hello"`, `'world'`)。
    -   `number`: 数字 (包括整数和浮点数，如 `42`, `3.14`)。包含特殊值 `NaN` (Not a Number), `Infinity`, `-Infinity`。
    -   `boolean`: 布尔值 (`true` 或 `false`)。
    -   `null`: 表示“空”或“无”的值，是一个只有一个值 `null` 的特殊类型。通常用来表示一个变量预期是对象但当前没有指向任何对象。
    -   `undefined`: 表示“未定义”的值，是一个只有一个值 `undefined` 的特殊类型。变量声明但未赋值时默认为 `undefined`。
    -   `symbol` (ES6): 独一无二、不可变的值，主要用作对象属性的键，避免命名冲突。通过 `Symbol()` 创建。
    -   `bigint` (ES2020): 用于表示任意精度的整数，可以安全地处理超出 `Number` 类型安全整数范围（`Number.MAX_SAFE_INTEGER`）的大数。通过在整数字面量后加 `n` 或调用 `BigInt()` 创建 (如 `123n`)。
2.  **引用类型 (Reference Types)** / **对象类型 (Object Types)**: 值是可变的，存储在堆内存中，变量存储的是指向该对象的引用（内存地址）。
    -   `Object`: 最基本的对象类型，包括：
        -   普通对象 (`{ key: value }`)
        -   数组 (`Array`)
        -   函数 (`Function`)
        -   日期 (`Date`)
        -   正则表达式 (`RegExp`)
        -   错误 (`Error`)
        -   以及 Map, Set, WeakMap, WeakSet 等。

**类型检测**:

-   **`typeof`**: 返回一个表示操作数类型的字符串。对于大多数原始类型能正确返回 (`"string"`, `"number"`, `"boolean"`, `"undefined"`, `"symbol"`, `"bigint"`)，但对于 `null` 会返回 `"object"` (历史遗留问题)，对于函数返回 `"function"`，对于其他所有引用类型都返回 `"object"`。
    ```javascript
    typeof "hello"; // "string"
    typeof 42;      // "number"
    typeof true;    // "boolean"
    typeof undefined;// "undefined"
    typeof Symbol(); // "symbol"
    typeof 123n;    // "bigint"
    typeof null;    // "object" (注意!)
    typeof {};      // "object"
    typeof [];      // "object"
    typeof function(){}; // "function"
    ```
-   **`instanceof`**: 检测构造函数的 `prototype` 是否出现在对象的原型链上。主要用于判断引用类型。
    ```javascript
    const arr = [];
    const date = new Date();
    arr instanceof Array;  // true
    date instanceof Date;  // true
    date instanceof Object; // true (因为 Date 继承自 Object)
    ```
-   **`Object.prototype.toString.call()`**: 最可靠的类型检测方法，可以精确区分各种内置对象类型。
    ```javascript
    Object.prototype.toString.call("hello"); // "[object String]"
    Object.prototype.toString.call(42);      // "[object Number]"
    Object.prototype.toString.call(true);    // "[object Boolean]"
    Object.prototype.toString.call(undefined); // "[object Undefined]"
    Object.prototype.toString.call(null);    // "[object Null]"
    Object.prototype.toString.call({});      // "[object Object]"
    Object.prototype.toString.call([]);      // "[object Array]"
    Object.prototype.toString.call(function(){}); // "[object Function]"
    Object.prototype.toString.call(new Date());  // "[object Date]"
    ```

#### 3.1.2 变量与作用域 (Variables & Scope)

-   **变量声明**:
    -   `var`: 函数作用域或全局作用域，存在变量提升 (hoisting)，允许重复声明。**在现代 JS 中已不推荐使用**。
    -   `let` (ES6): 块级作用域 (`{}` 内)，不存在变量提升（存在暂时性死区 TDZ），不允许在同一作用域内重复声明。
    -   `const` (ES6): 块级作用域，不存在变量提升（TDZ），不允许重复声明。声明时**必须初始化**，且声明的是一个**常量引用**。对于原始类型，值不可变；对于引用类型，引用不可变，但对象本身的内容可以修改。
        ```javascript
        // var (不推荐)
        function testVar() {
          console.log(a); // undefined (hoisting)
          if (true) {
            var a = 10;
          }
          console.log(a); // 10 (函数作用域)
        }

        // let
        function testLet() {
          // console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
          if (true) {
            let b = 20;
            console.log(b); // 20
          }
          // console.log(b); // ReferenceError: b is not defined (块级作用域)
          let b = 30; // OK, 不同作用域
          // let b = 40; // SyntaxError: Identifier 'b' has already been declared
        }

        // const
        const PI = 3.14;
        // PI = 3.14159; // TypeError: Assignment to constant variable.

        const obj = { name: "Alice" };
        obj.name = "Bob"; // OK, 修改对象内容
        console.log(obj); // { name: 'Bob' }
        // obj = { age: 30 }; // TypeError: Assignment to constant variable. (引用不可变)
        ```
-   **作用域 (Scope)**: 定义了变量和函数的可访问范围。
    -   **全局作用域 (Global Scope)**: 在代码顶层或函数外部声明的变量。
    -   **函数作用域 (Function Scope)**: 在函数内部声明的变量 (`var`)。
    -   **块级作用域 (Block Scope)** (ES6): 使用 `{}` 包裹的代码块（如 `if`, `for`, `while` 或单独的 `{}`），`let` 和 `const` 声明的变量在此作用域内有效。
    -   **词法作用域 (Lexical Scoping)**: 作用域在代码**定义时**就确定了，而不是在执行时。内部函数可以访问其外部（父级）函数的变量。
-   **作用域链 (Scope Chain)**: 当查找变量时，JavaScript 会从当前作用域开始，如果找不到，则逐级向上层作用域查找，直到全局作用域。如果在全局作用域也找不到，则抛出 `ReferenceError`。
-   **变量提升 (Hoisting)**: 使用 `var` 声明的变量和函数声明 (`function funcName(){...}`) 会在代码执行前被“提升”到其作用域的顶部。变量提升只提升声明，不提升初始化；函数声明会提升整个函数体。`let` 和 `const` 不存在变量提升，它们有**暂时性死区 (Temporal Dead Zone, TDZ)**，即在声明语句之前访问会抛出错误。

#### 3.1.3 运算符 (Operators)

-   **算术**: `+`, `-`, `*`, `/`, `%` (取模), `**` (幂, ES7)。
-   **赋值**: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `&&=`, `||=`, `??=` (逻辑赋值, ES2021)。
-   **比较**: `==` (相等, 会进行类型转换), `===` (严格相等, 不进行类型转换 - **推荐使用**), `!=`, `!==`, `>`, `<`, `>=`, `<=`。
-   **逻辑**: `&&` (与), `||` (或), `!` (非)。
-   **位**: `&` (与), `|` (或), `^` (异或), `~` (非), `<<` (左移), `>>` (有符号右移), `>>>` (无符号右移)。(在前端不常用，但在特定场景如图形处理、性能优化中有用)。
-   **三元**: `condition ? value_if_true : value_if_false`。
-   **逗号**: `,` (顺序执行，返回最后一个表达式的值)。
-   **一元**: `+` (转数字), `-` (负号), `++` (自增), `--` (自减)。
-   **关系**: `in` (检查对象是否有某属性), `instanceof` (检查对象原型链)。
-   **其他**: `typeof`, `void`, `delete`, `new`, `?.` (可选链, ES2020), `??` (空值合并, ES2020)。

#### 3.1.4 控制流 (Control Flow)

控制代码执行顺序。

-   **条件语句**:
    -   `if...else if...else`
    -   `switch...case...default...break`
-   **循环语句**:
    -   `for (initialization; condition; final-expression)`
    -   `while (condition)`
    -   `do...while (condition)` (至少执行一次)
    -   `for...in`: 遍历对象的**可枚举属性名 (键)** (包括原型链上的)，顺序不保证。通常不推荐用于遍历数组。
        ```javascript
        const user = { name: 'Alice', age: 30 };
        for (const key in user) {
          if (user.hasOwnProperty(key)) { // 推荐检查是否是自身属性
            console.log(`${key}: ${user[key]}`);
          }
        }
        // 输出:
        // name: Alice
        // age: 30
        ```
    -   `for...of` (ES6): 遍历**可迭代对象 (Iterable)** 的**值** (如 Array, String, Map, Set, NodeList)。是遍历数组和类数组对象的推荐方式。
        ```javascript
        const colors = ['red', 'green', 'blue'];
        for (const color of colors) {
          console.log(color);
        }
        // 输出: red, green, blue

        const str = "Hi";
        for(const char of str) {
            console.log(char); // H, i
        }
        ```
-   **跳转语句**:
    -   `break`: 跳出当前循环或 `switch` 语句。
    -   `continue`: 跳过当前循环的剩余部分，进入下一次迭代。
    -   `return`: 从函数中返回值并退出函数。
    -   `throw`: 抛出一个错误。
-   **异常处理**: `try...catch...finally`
    ```javascript
    try {
      // 可能抛出错误的代码
      const result = riskyOperation();
      console.log(result);
    } catch (error) {
      // 捕获并处理错误
      console.error("An error occurred:", error.message);
    } finally {
      // 无论是否发生错误，总会执行的代码 (可选)
      console.log("Operation finished.");
    }
    ```

#### 3.1.5 函数 (Functions)

JavaScript 中函数是一等公民，可以像变量一样传递和赋值。

-   **函数声明 (Function Declaration)**:
    ```javascript
    function greet(name) {
      return `Hello, ${name}!`;
    }
    // 函数声明存在提升
    ```
-   **函数表达式 (Function Expression)**:
    ```javascript
    const greet = function(name) {
      return `Hello, ${name}!`;
    };
    // 函数表达式不存在提升 (变量声明提升，但赋值不提升)
    ```
-   **箭头函数 (Arrow Functions)** (ES6): 更简洁的语法，且**不绑定自己的 `this`, `arguments`, `super` 或 `new.target`**。它们从**定义时所在的词法作用域**继承 `this`。通常不适用于定义对象方法或构造函数。
    ```javascript
    const add = (a, b) => a + b;

    const numbers = [1, 2, 3];
    const doubled = numbers.map(n => n * 2); // [2, 4, 6]

    // 箭头函数 this 示例
    function Timer() {
      this.seconds = 0;
      setInterval(() => {
        this.seconds++; // 这里的 this 指向 Timer 实例
        // console.log(this.seconds);
      }, 1000);
    }
    // const timer = new Timer();
    ```
-   **参数 (Parameters)**:
    -   **默认参数 (Default Parameters)** (ES6): `function fn(a = 1, b = 2) {...}`
    -   **剩余参数 (Rest Parameters)** (ES6): `function sum(...numbers) {...}` 将多余的参数收集到一个数组中。必须是最后一个参数。
-   **返回值 (Return Value)**: 使用 `return` 语句。如果没有 `return` 或 `return` 后没有值，函数默认返回 `undefined`。
-   **IIFE (Immediately Invoked Function Expression)**: 立即执行函数表达式，常用于创建独立作用域，避免污染全局。
    ```javascript
    (function() {
      var localVar = 'I am local';
      console.log(localVar);
    })();
    // console.log(localVar); // ReferenceError
    ```

#### 3.1.6 对象 (Objects)

键值对的集合，键是字符串或 Symbol，值可以是任何类型。

-   **创建**:
    -   **字面量 (Literal)**: `const obj = { key1: 'value1', 'key-2': 123 };` (推荐)
    -   **构造函数**: `const obj = new Object(); obj.key1 = 'value1';`
-   **属性访问**:
    -   **点表示法**: `obj.key1` (键名必须是有效的标识符)
    -   **方括号表示法**: `obj['key-2']` (键名可以是任意字符串或 Symbol，支持变量)
        ```javascript
        const propName = 'key1';
        console.log(obj[propName]); // 'value1'
        ```
-   **属性遍历**:
    -   `for...in`: 遍历自身及原型链上的可枚举属性名。
    -   `Object.keys(obj)` (ES5): 返回包含对象自身**可枚举**属性名的数组。
    -   `Object.getOwnPropertyNames(obj)` (ES5): 返回包含对象自身**所有**属性名（包括不可枚举，但不包括 Symbol）的数组。
    -   `Object.getOwnPropertySymbols(obj)` (ES6): 返回包含对象自身 Symbol 属性名的数组。
    -   `Reflect.ownKeys(obj)` (ES6): 返回包含对象自身**所有**属性名（字符串和 Symbol）的数组。
-   **属性检查**:
    -   `obj.hasOwnProperty(propName)`: 检查属性是否是对象自身的（非原型链上的）。
    -   `propName in obj`: 检查属性是否存在于对象自身或其原型链上。
-   **对象方法简写** (ES6):
    ```javascript
    const calculator = {
      add(a, b) { // 等同于 add: function(a, b) { ... }
        return a + b;
      }
    };
    ```
-   **计算属性名** (ES6):
    ```javascript
    const dynamicKey = 'age';
    const person = {
      name: 'Charlie',
      [dynamicKey]: 35
    };
    console.log(person); // { name: 'Charlie', age: 35 }
    ```
-   **展开语法 (`...`)** (ES2018 for objects): 用于浅拷贝或合并对象。
    ```javascript
    const defaults = { theme: 'light', notifications: true };
    const userSettings = { notifications: false, language: 'en' };
    const finalSettings = { ...defaults, ...userSettings }; // { theme: 'light', notifications: false, language: 'en' }
    const settingsCopy = { ...finalSettings }; // 浅拷贝
    ```

#### 3.1.7 数组 (Arrays)

有序的值列表，是特殊的对象，键是数字索引。

-   **创建**:
    -   **字面量**: `const arr = [1, 'two', true, { id: 3 }];` (推荐)
    -   **构造函数**: `const arr = new Array(1, 2, 3);` 或 `new Array(5);` (创建长度为 5 的空数组)
-   **访问与修改**: 通过索引 `arr[index]`，索引从 0 开始。`arr.length` 获取长度。
-   **常用方法**:
    -   **修改原数组**: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()`, `reverse()`, `fill()`。
    -   **不修改原数组 (返回新数组或值)**: `slice()`, `concat()`, `join()`, `indexOf()`, `lastIndexOf()`, `includes()`, `toString()`。
    -   **遍历方法**:
        -   `forEach((value, index, array) => {})`: 遍历每个元素，无返回值。
        -   `map((value, index, array) => newValue)`: 遍历每个元素，返回一个包含处理结果的新数组。
        -   `filter((value, index, array) => condition)`: 遍历每个元素，返回一个包含满足条件的元素的新数组。
        -   `reduce((accumulator, currentValue, index, array) => newAccumulator, initialValue)`: 将数组累积计算为一个值。
        -   `reduceRight()`: 从右向左的 `reduce`。
        -   `find((value, index, array) => condition)`: 返回第一个满足条件的元素值，否则返回 `undefined`。
        -   `findIndex((value, index, array) => condition)`: 返回第一个满足条件的元素索引，否则返回 `-1`。
        -   `some((value, index, array) => condition)`: 检查是否至少有一个元素满足条件 (返回 `boolean`)。
        -   `every((value, index, array) => condition)`: 检查是否所有元素都满足条件 (返回 `boolean`)。
    -   **ES6+ 新方法**:
        -   `Array.from()`: 将类数组对象或可迭代对象转换为真数组。
        -   `Array.of()`: 创建一个包含传入参数的新数组。
        -   `copyWithin()`: 在数组内部复制元素。
        -   `entries()`, `keys()`, `values()`: 返回迭代器对象。
        -   `flat(depth)` (ES2019): 将嵌套数组扁平化指定深度。
        -   `flatMap(callback)` (ES2019): 先 `map` 再 `flat(1)`。
        -   `at(index)` (ES2022): 支持负索引访问元素 (`arr.at(-1)` 访问最后一个元素)。
        -   `findLast(callback)` (ES2023): 从后向前查找满足条件的元素值。
        -   `findLastIndex(callback)` (ES2023): 从后向前查找满足条件的元素索引。
    -   **ES2023 改变原数组的方法的副本版本**: 返回新数组，不改变原数组。
        -   `toReversed()` -> `reverse()`
        -   `toSorted(compareFn)` -> `sort()`
        -   `toSpliced(start, deleteCount, ...items)` -> `splice()`
        -   `with(index, value)`: 返回替换了指定索引处元素的新数组。
-   **展开语法 (`...`)** (ES6 for arrays): 用于浅拷贝、合并数组、将数组元素作为函数参数传递。
    ```javascript
    const nums1 = [1, 2];
    const nums2 = [3, 4];
    const combined = [...nums1, ...nums2]; // [1, 2, 3, 4]
    const numsCopy = [...nums1]; // [1, 2]
    Math.max(...combined); // 4
    ```

### 3.2 面向对象与原型 (OOP & Prototypes)

JavaScript 的面向对象是基于原型的，ES6 的 `class` 只是语法糖。

#### 3.2.1 `this` 关键字

`this` 的值在函数**执行时**确定，取决于函数的调用方式。

1.  **全局上下文**: 在浏览器中通常指向 `window` 对象 (严格模式下是 `undefined`)。在 Node.js 模块顶层是 `module.exports`。
2.  **函数直接调用**: 非严格模式下指向全局对象 (`window`)，严格模式 (`'use strict'`) 下指向 `undefined`。
3.  **对象方法调用**: 指向调用该方法的对象 (`obj.method()` 中的 `this` 指向 `obj`)。
4.  **构造函数调用**: 使用 `new` 关键字调用函数时，`this` 指向新创建的实例对象。
5.  **箭头函数**: **不绑定自己的 `this`**，它会捕获其**定义时**所在的词法作用域的 `this` 值。
6.  **`call()`, `apply()`, `bind()`**: 显式设置函数执行时的 `this` 值。
    -   `func.call(thisArg, arg1, arg2, ...)`: 调用函数，`this` 设为 `thisArg`，参数逐个传入。
    -   `func.apply(thisArg, [argsArray])`: 调用函数，`this` 设为 `thisArg`，参数以数组形式传入。
    -   `func.bind(thisArg, arg1, arg2, ...)`: **返回一个新函数**，这个新函数的 `this` 永久绑定为 `thisArg`，并且可以预先设置部分参数。

#### 3.2.2 原型 (Prototype)

JavaScript 对象有一个内部链接指向另一个对象，称为它的**原型 (prototype)**。当试图访问一个对象的属性时，如果在对象本身找不到，就会沿着原型链向上查找，直到找到该属性或到达原型链末端 (`null`)。

-   **`Object.prototype`**: 所有普通对象的最终原型。
-   **`__proto__`** (非标准，但广泛实现): 对象实例访问其原型的属性 (ES6 推荐使用 `Object.getPrototypeOf()`)。
-   **`prototype`** (函数特有): 函数作为构造函数时，其 `prototype` 属性指向一个对象，这个对象将成为由该构造函数创建的**所有实例**的原型。
-   **`constructor`**: 每个原型对象都有一个 `constructor` 属性，指向关联的构造函数。

```javascript
function Person(name) {
  this.name = name;
}

// Person.prototype 是 Person 实例的原型
Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const alice = new Person('Alice');
const bob = new Person('Bob');

alice.sayHello(); // "Hello, my name is Alice" (在 Person.prototype 上找到)
bob.sayHello();   // "Hello, my name is Bob"

console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
console.log(alice.__proto__ === Person.prototype);          // true (非标准)
console.log(Person.prototype.constructor === Person);       // true
console.log(alice.constructor === Person);                // true (通过原型链找到)
```

#### 3.2.3 继承 (Inheritance)

在 JS 中模拟类继承关系。

-   **原型链继承 (ES5 及之前)**: 子类的原型指向父类的实例。
    -   缺点: 引用类型的属性会被所有实例共享，创建子类实例时无法向父类构造函数传递参数。
-   **构造函数继承 (借用构造函数)**: 在子类构造函数中使用 `Parent.call(this, ...args)`。
    -   优点: 可以向父类传递参数，解决了引用类型共享问题。
    -   缺点: 方法都在构造函数中定义，无法复用，父类原型上的方法子类无法访问。
-   **组合继承**: 结合原型链继承和构造函数继承。
    -   优点: 解决了上述两种方式的缺点。
    -   缺点: 调用了两次父类构造函数 (一次创建子类原型，一次在子类构造函数内 `call`)。
-   **寄生组合继承**: **推荐的 ES5 继承方式**。通过 `Object.create()` 创建父类原型的副本作为子类原型，避免了调用两次父类构造函数。
    ```javascript
    function Parent(name) { this.name = name; }
    Parent.prototype.sayName = function() { console.log(this.name); };

    function Child(name, age) {
      Parent.call(this, name); // 借用构造函数
      this.age = age;
    }

    // 核心：创建父类原型的副本作为子类原型
    Child.prototype = Object.create(Parent.prototype);
    // 修复 constructor 指向
    Child.prototype.constructor = Child;

    Child.prototype.sayAge = function() { console.log(this.age); };

    const child = new Child('Charlie', 10);
    child.sayName(); // Charlie
    child.sayAge();  // 10
    ```
-   **`class` 继承 (ES6)**: 使用 `class`, `extends`, `super` 关键字实现继承，语法更简洁清晰，本质上是寄生组合继承的语法糖。
    ```javascript
    class Parent {
      constructor(name) { this.name = name; }
      sayName() { console.log(this.name); }
      static staticMethod() { console.log('Parent static method'); } // 静态方法
    }

    class Child extends Parent {
      constructor(name, age) {
        super(name); // 调用父类构造函数，必须在 this 之前调用
        this.age = age;
      }
      sayAge() { console.log(this.age); }
      // 可以重写父类方法
      sayName() { console.log(`Child says: ${this.name}`); }
      static staticMethodChild() { console.log('Child static method');}
    }

    const child = new Child('David', 12);
    child.sayName(); // Child says: David
    child.sayAge();  // 12
    Child.staticMethod(); // Parent static method (静态方法也被继承)
    Child.staticMethodChild(); // Child static method
    ```

#### 3.2.4 闭包 (Closure)

**定义**: 一个函数以及其捆绑的周边环境状态（**词法环境**）的引用的组合。换句话说，闭包让函数能够“记住”并访问其定义时所在的词法作用域，即使该函数在其词法作用域之外执行。

-   **产生条件**:
    1.  存在嵌套函数。
    2.  内部函数引用了外部函数的变量。
    3.  内部函数在外部函数之外被调用（通常是外部函数返回了内部函数）。
-   **示例**:
    ```javascript
    function createCounter() {
      let count = 0; // 外部函数的变量
      return function() { // 内部函数，引用了 count
        count++;
        console.log(count);
      };
    }

    const counter1 = createCounter(); // counter1 持有对内部函数的引用及其闭包
    const counter2 = createCounter();

    counter1(); // 1
    counter1(); // 2
    counter2(); // 1 (每个 counter 有自己的闭包环境)
    // console.log(count); // ReferenceError: count is not defined (外部无法访问)
    ```
-   **应用**:
    -   **数据封装与私有变量**: 模拟私有成员。
    -   **模块化**: 在早期模块化方案 (如 IIFE) 中创建独立作用域。
    -   **柯里化 (Currying)** 与 **函数组合**。
    -   **实现防抖 (Debounce)** 与 **节流 (Throttle)**。
    -   **回调函数中保持状态**: 在循环中为事件监听器或异步回调传递正确的索引值。
-   **内存泄漏风险**: 如果闭包长时间持有对不再需要的外部变量（尤其是大型对象或 DOM 元素）的引用，可能导致内存无法被垃圾回收器回收。需要注意在适当的时候解除引用（例如，移除事件监听器，将变量设为 `null`）。

### 3.3 ES6 及后续版本核心特性 (ES2015 ~ ES2024+)

ECMAScript (ES) 是 JavaScript 的标准。从 ES6 (ES2015) 开始，每年都会发布新版本，带来大量改进和新特性。

#### 3.3.1 语法改进

-   `let`, `const`: 块级作用域变量声明 (见 3.1.2)。
-   **箭头函数 (`=>`)**: 简洁语法，词法 `this` (见 3.1.5)。
-   **模板字符串 (Template Literals)**: 使用反引号 `` ` `` 定义字符串，支持嵌入表达式 `${expression}` 和多行字符串。
-   **解构赋值 (Destructuring Assignment)**: 从数组或对象中提取值并赋给变量。
    ```javascript
    // 数组解构
    const [first, second, ...rest] = [10, 20, 30, 40];
    // first = 10, second = 20, rest = [30, 40]

    // 对象解构
    const { name: personName, age, city = 'Unknown' } = { name: 'Eve', age: 25 };
    // personName = 'Eve', age = 25, city = 'Unknown' (默认值)
    ```
-   **函数默认参数**: (见 3.1.5)。
-   **剩余参数 (`...rest`)**: (见 3.1.5)。
-   **展开语法 (`...spread`)**: 将可迭代对象（数组、字符串）或对象（ES2018）展开。用于数组/对象字面量、函数调用等 (见 3.1.6, 3.1.7)。

#### 3.3.2 异步编程

-   **Promise**: (见 [JavaScript 核心机制](./javascript核心机制.md) 1.2.2) 解决回调地狱，提供更优雅的异步处理方式。
-   **Generator/yield**: (见 [JavaScript 核心机制](./javascript核心机制.md) 1.2.3) 协程实现，可以暂停和恢复函数执行，是 `async/await` 的基础。
-   **`async/await`**: (见 [JavaScript 核心机制](./javascript核心机制.md) 1.2.4) 基于 Promise 和 Generator 的语法糖，使异步代码看起来像同步代码，易于读写。

#### 3.3.3 模块化 (ES Modules)

-   **`export`**: 导出模块中的变量、函数、类。
    -   命名导出: `export const myVar = 1; export function myFunc() {}`
    -   默认导出: `export default function() {}` (每个模块只能有一个默认导出)
-   **`import`**: 导入其他模块导出的内容。
    -   命名导入: `import { myVar, myFunc } from './myModule.js';`
    -   默认导入: `import myDefaultFunc from './myModule.js';`
    -   混合导入: `import myDefaultFunc, { myVar } from './myModule.js';`
    -   重命名导入: `import { myVar as anotherVar } from './myModule.js';`
    -   导入整个模块: `import * as myModule from './myModule.js';`
-   **特点**:
    -   **静态性**: 导入导出关系在编译时确定，有利于 Tree Shaking 等优化。
    -   **`import` 提升**: `import` 语句会被提升到模块顶部。
    -   默认在严格模式下运行。
    -   浏览器中使用需在 `<script>` 标签添加 `type="module"`。

#### 3.3.4 数据结构

-   **`Set`**: 成员值唯一的集合。类似于数组，但成员唯一。
-   **`Map`**: 键值对集合，键可以是**任意类型** (包括对象)，优于只能用字符串/Symbol 作键的普通对象。
-   **`WeakSet`**: 成员只能是**对象**的集合，且对成员是**弱引用**。如果对象没有其他引用，会被垃圾回收，WeakSet 中的引用不会阻止回收。不可遍历。
-   **`WeakMap`**: 键只能是**对象**的 Map，且对键是**弱引用**。适用于需要将数据与对象关联，又不希望阻止对象被回收的场景 (如缓存、私有数据)。不可遍历。

#### 3.3.5 迭代器 (Iterator) 与 for...of

-   **迭代协议**: 定义了对象如何产生一系列值。包含 `Symbol.iterator` 方法，该方法返回一个迭代器对象。
-   **迭代器对象**: 具有 `next()` 方法的对象，`next()` 返回 `{ value: any, done: boolean }`。
-   **`for...of`**: 自动遍历实现了迭代协议的对象。可以遍历 Array, String, Map, Set, arguments, NodeList 等内置可迭代对象，以及自定义的可迭代对象。

#### 3.3.6 代理 (Proxy) 与 反射 (Reflect)

-   **`Proxy`**: 用于创建一个对象的代理，可以**拦截并自定义**该对象的基本操作 (如属性查找、赋值、函数调用等)。`new Proxy(target, handler)`。`handler` 对象定义了各种“陷阱”(trap) 函数。
    -   **应用**: 数据绑定与响应式系统 (Vue 3)、数据验证、访问控制、日志记录。
-   **`Reflect`**: 一个内置对象，提供了与 `Proxy` 陷阱相对应的**默认**操作方法 (如 `Reflect.get()`, `Reflect.set()`, `Reflect.has()` 等)。它的方法与 `Object` 上的类似方法相比，通常更规范、更易用（如返回布尔值表示成功与否，而不是抛错）。`Proxy` 的陷阱函数内部通常调用对应的 `Reflect` 方法来执行默认行为。

#### 3.3.7 重要新增 API

(部分已在 3.1.6 和 3.1.7 中列出)

-   **数组**: `Array.from`, `Array.of`, `find`, `findIndex`, `includes`, `flat`, `flatMap`, `at`, `findLast`, `findLastIndex`, `toReversed`, `toSorted`, `toSpliced`, `with`。
-   **对象**: `Object.assign`, `Object.entries`, `Object.keys`, `Object.values`, `Object.fromEntries`, `Object.hasOwn` (ES2022, 替代 `hasOwnProperty`)。
-   **字符串**: `includes`, `startsWith`, `endsWith`, `padStart`, `padEnd`, `trimStart`, `trimEnd`, `replaceAll`, `matchAll`, `at`。
-   **数值**: `Number.isNaN`, `Number.isInteger`, `Number.isSafeInteger`, `BigInt`。
-   **正则表达式增强**:
    -   `y` (sticky) 和 `u` (unicode) 标志 (ES6)。
    -   命名捕获组: `(?<name>...)` (ES2018)。
    -   `s` (dotAll) 标志: `.` 匹配包括换行符在内的任意字符 (ES2018)。
    -   Lookbehind断言: `(?<=...)` 和 `(?<!...)` (ES2018)。
    -   `d` (indices) 标志: 提供匹配结果的起始和结束索引 (ES2022)。
    -   `v` (unicode sets) 标志: 更强大的 Unicode 属性转义、集合操作 (ES2024)。
-   **Promise**: `Promise.prototype.finally()` (ES2018), `Promise.allSettled()` (ES2020), `Promise.any()` (ES2021)。
-   **其他**: `globalThis` (ES2020, 提供统一访问全局对象的方式), `queueMicrotask()` (见事件循环)。

#### 3.3.8 语法糖与便捷特性

-   **可选链 (`?.`)** (ES2020): 安全地访问深层嵌套对象的属性或方法，如果链中某个环节是 `null` 或 `undefined`，则短路并返回 `undefined`。`obj?.prop?.method?.()`。
-   **空值合并运算符 (`??`)** (ES2020): `left ?? right`。如果 `left` 是 `null` 或 `undefined`，则返回 `right`，否则返回 `left`。与 `||` 不同，`||` 会在 `left` 是任何 "falsy" 值 (如 `0`, `''`, `false`) 时返回 `right`。
-   **逻辑赋值运算符 (`||=`, `&&=`, `??=`)** (ES2021): 结合了逻辑运算和赋值。
    -   `a ||= b` 等价于 `a || (a = b)` (如果 a 是 falsy，则赋值)
    -   `a &&= b` 等价于 `a && (a = b)` (如果 a 是 truthy，则赋值)
    -   `a ??= b` 等价于 `a ?? (a = b)` (如果 a 是 null 或 undefined，则赋值)
-   **数值分隔符 (`_`)** (ES2021): 提高数字字面量的可读性 `1_000_000`。

#### 3.3.9 类 (Class) 相关特性

-   **私有类字段/方法 (`#`)** (ES2022): 使用 `#` 前缀定义类内部的私有成员，外部无法访问。
    ```javascript
    class Counter {
      #count = 0; // 私有字段
      #increment() { // 私有方法
        this.#count++;
      }
      getCount() {
        this.#increment();
        return this.#count;
      }
    }
    const c = new Counter();
    console.log(c.getCount()); // 1
    // console.log(c.#count); // SyntaxError
    // c.#increment(); // SyntaxError
    ```
-   **静态类块 (`static {}`)** (ES2022): 在类定义时执行一次，用于初始化静态成员或执行其他设置。
    ```javascript
    class MyClass {
      static staticProperty;
      static { // 静态初始化块
        // 可以在这里执行复杂的静态成员初始化
        MyClass.staticProperty = 'initialized';
        console.log('Static block executed.');
      }
    }
    // 输出: Static block executed.
    console.log(MyClass.staticProperty); // initialized
    ```
-   **类实例私有方法和访问器** (ES2022)。
-   **类静态私有方法和访问器** (ES2022)。

#### 3.3.10 Top-level `await` (ES2022)

允许在 ES 模块的顶层作用域直接使用 `await`，无需包裹在 `async` 函数中。简化了异步初始化等场景。

```javascript
// myModule.js
// (需要确保环境支持 Top-level await, 如现代浏览器 type="module" 或 Node.js 14.8+)
const data = await fetch('/api/data');
const jsonData = await data.json();
console.log('Module loaded with data:', jsonData);

export default jsonData;
```

#### 3.3.11 持续关注 TC39

ECMAScript 的发展仍在继续。关注 TC39 (ECMAScript 标准的技术委员会) 的提案进度 (stages 0-4) 可以了解未来的语言特性，例如：

-   **Decorators**: (已进入 Stage 3) 为类和类成员提供注解和元编程能力。
-   **Temporal API**: (已进入 Stage 3) 现代化的日期和时间 API，解决 `Date` 对象的诸多问题。
-   **Records & Tuples**: (Stage 2) 深度不可变的原始数据结构。
-   **Pipe Operator (`|>`)**: (Stage 2) 简化函数链式调用。

### 3.4 函数式编程思想 (Functional Programming, FP)

一种编程范式，强调使用**纯函数**、**避免副作用**、**数据不可变性**以及**声明式**的代码风格。

#### 3.4.1 核心概念

-   **纯函数 (Pure Functions)**:
    -   **定义**: 对于相同的输入，总是产生相同的输出，并且没有任何可观察的副作用（不修改外部状态、不进行 I/O 操作等）。
    -   **优点**: 可预测、易测试、易推理、易于并行化。
    ```javascript
    // 纯函数
    function add(a, b) { return a + b; }
    // 非纯函数 (有副作用：修改了外部变量)
    let z = 1;
    function addToZ(x) { z += x; return z; }
    // 非纯函数 (依赖外部状态)
    function getWindowWidth() { return window.innerWidth; }
    ```
-   **不可变性 (Immutability)**:
    -   **理念**: 数据一旦创建，就不应被修改。需要修改时，应创建并返回新的数据副本。
    -   **优点**: 避免意外的副作用，简化状态追踪（特别是在复杂应用中），利于实现撤销/重做、时间旅行调试等。
    -   **实践**:
        -   避免直接修改对象和数组 (使用 `...spread`, `slice`, `map`, `filter`, `reduce` 等返回新副本)。
        -   使用 `const` 声明变量 (但注意 `const` 只保证引用不变，不保证内容不变)。
        -   考虑使用 Immer.js 或 Immutable.js 等库来帮助管理不可变数据。
-   **高阶函数 (Higher-Order Functions, HOF)**:
    -   **定义**: 接受一个或多个函数作为参数，或返回一个函数的函数。
    -   **例子**: `Array.prototype.map`, `filter`, `reduce`, `setTimeout`, 事件监听器的回调。
    -   **优点**: 抽象、代码复用、行为参数化。
-   **函数组合 (Function Composition)**:
    -   **理念**: 将多个简单的、单一职责的函数组合起来，形成更复杂的功能。数据像水流一样依次通过各个函数处理。
    -   **实现**: `f(g(x))` 或使用 `compose`/`pipe` 辅助函数。
        ```javascript
        const compose = (f, g) => x => f(g(x));
        const toUpperCase = str => str.toUpperCase();
        const exclaim = str => `${str}!`;
        const shout = compose(exclaim, toUpperCase);
        console.log(shout('hello')); // "HELLO!"
        ```
-   **柯里化 (Currying)**:
    -   **定义**: 将一个接受多个参数的函数，转换成一系列只接受单个参数的函数的过程。每一步都返回一个等待下一个参数的新函数，直到所有参数都传入后才最终计算结果。
    -   **优点**: 参数复用、延迟计算、创建特定功能的函数。
    ```javascript
    // 普通函数
    // const add = (a, b, c) => a + b + c;
    // 柯里化后
    const curriedAdd = a => b => c => a + b + c;
    const add5 = curriedAdd(5); // 返回一个新函数 b => c => 5 + b + c
    const add5and3 = add5(3); // 返回一个新函数 c => 5 + 3 + c
    console.log(add5and3(2)); // 10
    console.log(curriedAdd(1)(2)(3)); // 6
    ```
-   **声明式 vs 命令式 (Declarative vs Imperative)**:
    -   **命令式**: 关注**如何**做 (How)，描述执行步骤。
    -   **声明式**: 关注**做什么** (What)，描述期望的结果，隐藏实现细节。函数式编程倾向于声明式。
    ```javascript
    const numbers = [1, 2, 3, 4];
    // 命令式: 如何将数组元素翻倍
    const doubledImp = [];
    for (let i = 0; i < numbers.length; i++) {
      doubledImp.push(numbers[i] * 2);
    }
    // 声明式: 描述“将数组每个元素翻倍”这个目标
    const doubledDec = numbers.map(n => n * 2);
    ```

#### 3.4.2 JavaScript 中的函数式实践

-   **多用 `map`, `filter`, `reduce`**: 替代命令式的 `for` 循环进行数组转换和处理，代码更简洁、声明式。
-   **保持函数纯净**: 尽量编写无副作用的函数，明确函数的输入和输出。对于有副作用的操作（如网络请求、DOM 操作），将其隔离或封装。
-   **拥抱不可变性**: 特别是在处理状态（如 React state, Redux store）时，使用 `...spread` 或相关库创建新状态，而不是直接修改。
-   **利用高阶函数**: 创建可复用的逻辑（如自定义 Hooks in React，工具函数）。
-   **适度函数组合**: 对于复杂的数据流或处理逻辑，考虑使用函数组合简化代码。

函数式编程不是要完全取代其他范式，而是提供一种有用的思维方式和工具集，可以与其他范式（如面向对象）结合使用，编写出更清晰、健壮、可维护的代码。