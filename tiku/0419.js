// 题目1：实现加减乘除
// 实现一个计算器函数 calculator，支持基本的加减乘除四则运算，并且能够处理小数、负数等情况。
// 函数接口如下：calculator(expression)，其中 expression 为包含数字和运算符的字符串表达式，如 "1+2*3"。
// 要求：
// 1. 支持加(+)、减(-)、乘(*)、除(/)四种运算
// 2. 支持小数、负数计算
// 3. 按照四则运算规则，先乘除后加减
// 4. 注意处理除数为 0 的情况
// 示例：
// 输入：calculator("5+3")
// 输出：8
// 输入：calculator("5-3")
// 输出：2
// 输入：calculator("5*3")
// 输出：15
// 输入：calculator("5/2")
// 输出：2.5
// 输入：calculator("5/0")
// 输出：Error: Division by zero
// 输入：calculator("-5+3/2")
// 输出：-3.5
// 输入：calculator("2*3+4/2")
// 输出：8

const calculator = (expression) => {
  // tokens 的两种实现
  // 1. 正则匹配，负号和小数点优先跟数字
  // const tokens = expression.match(/(-?\d+\.?\d+)|[\+\-\*\/]/) 
  // 直接得到类似 ['5', '+', '3'] 或者 ['1', '+', '2', '-3', '*', '2', '-', '-5'] 的表达式
  // 2. 不使用正则，手动处理字符
  // 标准的运算表达式，数字都在运算符前后，如 -123.5+678，所以负号和小数当成数字处理
  // 负号有两种情况，要么是第一位，要么紧跟在运算符后面
  const tokens = []
  const isNumber = (char) => {
    return (char >= 0 && char <= 9) || char === '.'
  }
  const isOperator = (char) => {
    return char === '+' || char === '-' || char === '*' || char === '/';
  }
  let currNumber = ''
  for(let i=0; i<expression.length; i++) {
    const char = expression[i]
    if(isNumber(char)) { // 处理数字
      currNumber += char
    } else if(char === '-' && (i!==0 || isOperator(expression[i-1]))) { // 处理负号
      currNumber= '-' // 只有负号会出现这种情况，第一个负号进不了这里
    } else if(isOperator(char)){
      if(currNumber) {
        tokens.push(currNumber)
        currNumber = ''
      }
      tokens.push(char)
    }
  }
  if(currNumber) {
    tokens.push(currNumber) // 迭代结束后，最后一个数字要 push 
  }
  // 计算实现，先乘除，后加减；处理小数和负号；
  for(let i = 0; i < tokens.length; i++) {
    if(tokens[i] === '*' || tokens[i] === '/') {
      const prev = parseFloat(tokens[i-1])
      const next = parseFloat(tokens[i+1])
      let result = 0
      if(tokens[i] === '*') {
        result = prev * next
      }
      if(tokens[i] === '/') {
        if(next === 0) {
          throw new Error('Division by zero')
        }
        result = prev / next
      }
      tokens.splice(i-1, 3, result)
      i--
    }
  }
  // 加减需要累加或累减，是一个累计过程，不是区间计算，除非和乘除一样，每次计算完 splice 
  let result = parseFloat(tokens[0])
  for(let i = 1; i < tokens.length; i+=2) {
    if(tokens[i] === '+' || tokens[i] === '-') {
      const next = parseFloat(tokens[i+1])
      result = tokens[i] === '+' ? result + next : result - next
    }
  }
  return result
}



// 题目2：合并 n 个有序数组
// 实现一个函数 mergeArrays，接收一个二维数组 arrays，其中每个子数组都已经按升序排列。
// 要求：合并所有数组并保持元素升序排列，返回一个新的有序数组。
// 进阶：尝试使用最优的时间复杂度实现。
// 示例：
// 输入：mergeArrays([[1, 3, 5], [2, 4, 6], [7, 8, 9]])
// 输出：[1, 2, 3, 4, 5, 6, 7, 8, 9]
// 输入：mergeArrays([[1, 4, 7], [2, 5, 8], [3, 6, 9]])
// 输出：[1, 2, 3, 4, 5, 6, 7, 8, 9]

// 逐个合并
const mergeArrays = (arrays) => {
  if(arrays.length <= 1) return arrays
  let result = arrays[0]
  for(let i = 1; i < arrays.length; i++) {
    const merged = []
    let k = 0, j = 0;
    while(k< result.length && j < arrays[i].length) {
      merged.push(result[k] < arrays[i][j] ? result[k++] : arrays[i][j++])
    }
    result = merged.concat(result.slice(k), arrays[i].slice(j))
  }
  return result
}

// 分治
// 先构造有序数组排序的方法， 和上面类似
const merge2Arrays = (arr1, arr2) => {
  const merged = []
  let k = 0, j = 0;
  while(k< arr1.length && j < arr2.length) {
    merged.push(arr1[k] < arr2[j] ? arr1[k++] : arr2[j++])
  }
  return merged.concat(arr1.slice(k), arr2.slice(j))
}
// 再实现分治
const mergeArrays2 = (arrays) => {
  const merge = (start, end) => {
    if(start === end) return arrays[start] // 停止符
    const mid = Math.floor((start+end)/2)
    const left = merge(start, mid)
    const right = merge(mid+1, end)
    return merge2Arrays(left, right)
  }
  return merge(0, arrays.length-1)
}


// 题目3：实现带重试功能的函数调用
// 实现一个 retry 函数，接受三个参数：
// - fn: 需要执行的函数
// - limit: 最大重试次数
// - interval: 重试间隔时间(ms)
// 该函数会执行 fn，如果 fn 执行失败则进行重试，直到成功或达到最大重试次数。
// 函数返回一个 Promise，成功时 resolve 结果，失败时 reject 最后一次的错误。
// 示例：
// 输入：
// let count = 0;
// const mockFn = () => {
//   return new Promise((resolve, reject) => {
//     count++;
//     if (count < 3) {
//       reject(new Error(`Attempt ${count} failed`));
//     } else {
//       resolve("Success!");
//     }
//   });
// };
// retry(mockFn, 3, 100).then(console.log).catch(console.error);
// 输出："Success!"（在两次失败后第三次成功）
//
// 如果将 limit 设置为 2：
// retry(mockFn, 2, 100).then(console.log).catch(console.error);
// 输出：Error: Attempt 2 failed（因为最大重试次数设为2，第二次失败后不再尝试）


const retry = (fn, limit=3, interval=100) => {
  let count = 1
  // let resolve, reject
  // const promise = new Promise((resolve, reject) => {
  //   resolve = resolve
  //   reject = reject
  // })
  const {promise, resolve, reject} = Promise.withResolvers()
  const timer = setInterval(async () => {
    try {
      const res = await fn()
      resolve(res)
      clearInterval(timer)
    } catch (error) {
      if(count >= limit) {
        reject(error)
        clearInterval(timer)
      }
    }
    count++
  }, interval)
  return promise
}


// 题目4：实现事件发布订阅模式
// 实现一个 EventEmitter 类，包含以下方法：
// - on(event, callback): 订阅事件
// - off(event, callback): 取消订阅
// - once(event, callback): 订阅事件，但只触发一次
// - emit(event, ...args): 触发事件，并传递参数给回调函数
// 示例：
// 输入：
// const eventEmitter = new EventEmitter();
// function greeting(name) {
//   console.log(`Hello ${name}`);
// }
// eventEmitter.on('greet', greeting);
// eventEmitter.emit('greet', 'Jack');
// eventEmitter.off('greet', greeting);
// eventEmitter.emit('greet', 'Jack');
// 输出：
// "Hello Jack"
// （第二次 emit 不会有输出，因为已经取消了订阅）
//
// 使用 once 的例子：
// 输入：
// eventEmitter.once('welcome', name => console.log(`Welcome ${name}`));
// eventEmitter.emit('welcome', 'Tom');
// eventEmitter.emit('welcome', 'Tom');
// 输出：
// "Welcome Tom"
// （第二次 emit 不会有输出，因为 once 只触发一次）

class EventEmitter {
  eventMap = {}
  on(event, fn) {
    if(!this.eventMap[event]) {
      this.eventMap[event] = [fn]
    } else {
      this.eventMap[event].push(fn)
    }
  }
  once(event, fn) {
    const onceFn = (...args) => {
      fn(...args)
      this.off(event, onceFn)
    }
    this.on(event, onceFn)
  }
  emit(event, ...args) {
    const queue = this.eventMap[event]
    if(!queue?.length) return
    queue.forEach(fn => fn(...args))
  }
  off(event, fn) {
    const queue = this.eventMap[event]
    if(!queue?.length) return
    this.eventMap[event] = queue.filter(f => f !== fn)
  }
}

// 题目5：用栈模拟函数调用过程
// 实现一个 CallStack 类，模拟 JavaScript 的函数调用栈，包含以下方法：
// - push(functionName): 将函数压入调用栈
// - pop(): 将函数弹出调用栈
// - peek(): 查看栈顶函数
// - size(): 获取调用栈大小
// - trace(): 打印当前的调用栈追踪信息
// 示例：
// 输入：
// const callStack = new CallStack();
// callStack.push('main');
// callStack.push('getUserData');
// callStack.push('fetchAPI');
// console.log(callStack.size());
// console.log(callStack.peek());
// callStack.trace();
// callStack.pop();
// console.log(callStack.peek());
// 输出：
// 3
// "fetchAPI"
// "Error: at fetchAPI at getUserData at main"
// "getUserData"

class CallStack {
  stack = []
  push(fn) {
    this.stack.push(fn)
  }
  pop(fn) {
    return this.stack.pop()
  }
  peek() {
    return this.stack[this.stack.length-1]
  }
  size() {
    return this.stack.length
  }
}



// 题目6：实现 Generator 的 co 函数
// 实现一个 co 函数，用于自动执行 Generator 函数，并返回 Promise。
// co 函数接收一个 Generator 函数作为参数，返回一个 Promise。
// 可以自动执行 Generator 中的异步操作，类似 async/await 的效果。
// 提示：对 Generator 执行后的每个 yield 返回值（可能是 Promise）进行处理。
// 示例：
// 输入：
// function fetchData() {
//   return new Promise(resolve => setTimeout(() => resolve('data'), 100));
// }
// function* gen() {
//   const data = yield fetchData();
//   return `Processed ${data}`;
// }
// co(gen).then(console.log);
// 输出： "Processed data"


const co1 = async (gen) => {
  const g = gen()
  let res
  let data
  while(!(res = g.next(data)).done) {
    await Promise.resolve(res.value).then(r => data = r)
  }
  return res.value
}

const co = (gen) => {
  return new Promise((resolve, reject) => {
    const g = gen()
    const next = (data) => {
      try {
        const res = g.next()
        if(res.done) return resolve(res.value)
        Promise.resolve(res.value).then(r => next(r), reject)
      } catch (error) {
        reject(error)
      }
    }
    next()
  })
}


// 题目7：为树结构添加 parentId 和 level 属性
// 给定一个树形结构的数据（每个节点包含 id 和 children 数组），
// 实现一个函数 processTree，为每个节点添加 parentId 和 level 属性。
// - parentId: 父节点的 id，根节点的 parentId 为 null
// - level: 节点的层级，根节点的 level 为 0
// 示例：
// 输入：
// const tree = {
//   id: 1,
//   children: [
//     {
//       id: 2,
//       children: [{ id: 4, children: [] }]
//     },
//     {
//       id: 3,
//       children: []
//     }
//   ]
// };
// processTree(tree);
// 输出：
// {
//   id: 1,
//   children: [
//     {
//       id: 2,
//       parentId: 1,
//       level: 1,
//       children: [{ id: 4, parentId: 2, level: 2, children: [] }]
//     },
//     {
//       id: 3,
//       parentId: 1,
//       level: 1,
//       children: []
//     }
//   ],
//   parentId: null,
//   level: 0
// }



// 题目8：版本号排序
// 实现一个 sortVersions 函数，接收一个版本号数组，按照版本号从小到大排序。
// 版本号格式为：x.y.z，例如：1.0.0、2.3.5、0.1.1 等。
// 排序规则：主版本号优先，相同则比较次版本号，再相同则比较修订号。
// 示例：
// 输入：sortVersions(['1.0.0', '2.0.0', '0.1.1', '1.0.1', '1.1.0'])
// 输出：['0.1.1', '1.0.0', '1.0.1', '1.1.0', '2.0.0']
// 输入：sortVersions(['1.10.0', '1.2.0', '1.1.0'])
// 输出：['1.1.0', '1.2.0', '1.10.0']

const sortVersions = (array) => {
  const _array = array.map(ver => ver.split('.'))
  const sort = (arr1, arr2) => {
    let i = 0
    while(i < arr1.length) {
      if(arr1[i] !== arr2[i]) {
        return (arr1[i] - arr2[i]) < 0 
      }
      i++
    }
  }
  for(let i = 0; i < array.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < _array.length; j ++) {
      if(sort(_array[j], _array[minIndex])) {
        minIndex = j
      }
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]]
    [_array[i], _array[minIndex]] = [_array[minIndex], _array[i]]
  }
  return array
}



// 题目9：将列表转换为树结构
// 实现一个 listToTree 函数，将扁平的列表结构转换为树形结构。
// 每个列表项有 id 和 parentId 属性，根据这些属性构建树形结构。
// 示例：
// 输入：
// const list = [
//   { id: 1, parentId: null, name: '部门A' },
//   { id: 2, parentId: 1, name: '部门B' },
//   { id: 3, parentId: 1, name: '部门C' },
//   { id: 4, parentId: 3, name: '部门D' },
//   { id: 5, parentId: 4, name: '部门E' }
// ];
// listToTree(list);
// 输出：
// [
//   {
//     id: 1,
//     parentId: null,
//     name: '部门A',
//     children: [
//       {
//         id: 2,
//         parentId: 1,
//         name: '部门B',
//         children: []
//       },
//       {
//         id: 3,
//         parentId: 1,
//         name: '部门C',
//         children: [
//           {
//             id: 4,
//             parentId: 3,
//             name: '部门D',
//             children: [
//               {
//                 id: 5,
//                 parentId: 4,
//                 name: '部门E',
//                 children: []
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ]

const listToTree = (list) => {
  const getChildren = (targetId) => {
    // 改为 map 实现，仅需一次循环
    return list.filter(item => item.parentId === targetId)
  }
  const buildTree = (rootId) => {
    const children = getChildren(rootId)
    return children.map(item => {
      const children = buildTree(item.id)
      return {
        ...item,
        children
      }
    })
  }
  return buildTree(null)
}


// 题目10：对象扁平化
/*
将嵌套的对象扁平化处理，变成一层结构，key 用点号连接。
例如：
```js
var entry = {
    a: {
        b: {
            c: {
                dd: "abcdd",
                ff: "abcff"
            },
        },
        d: {
            xx: "adxx",
        },
        e: "ae"
    },
};
// 要求转换成如下对象
var output = {
 "a.b.c.dd": "abcdd",
 "a.d.xx": "adxx",
 "a.e": "ae",
};
```
实现一个 flattenObject 函数完成上述转换。

示例：
输入：
flattenObject({
  a: {
    b: 1,
    c: {
      d: 2,
      e: [1, 2, 3]
    }
  },
  f: 4
});
输出：
{
  "a.b": 1,
  "a.c.d": 2,
  "a.c.e": [1, 2, 3],
  "f": 4
}
*/

const flattenObject = (obj) => {
  const result = {}
  const traversal = (o, prefix = '') => {
    Object.keys(o).forEach(key => {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (typeof o[key] === 'object' && o[key] !== null && !Array.isArray(o[key])) {
        traversal(o[key], newKey)
      } else {
        result[newKey] = o[key]
      }
    })
  }
  traversal(obj)
  return result
}

// 题目11：数组去重
// 实现一个 unique 函数，对数组进行去重。
// 要求：
// 1. 考虑多种数据类型（数字、字符串、布尔值、null、undefined、对象、数组等）
// 2. 尝试多种实现方式（Set、双重循环、filter+indexOf 等）
// 3. 分析各实现方式的优缺点和适用场景
// 示例：
// 输入：unique([1, 1, '1', '1', true, true, {a: 1}, {a: 1}, [1], [1], null, null, undefined, undefined])
// 输出：[1, '1', true, {a: 1}, {a: 1}, [1], [1], null, undefined]
// （注意：对于对象和数组，如果内容相同但引用不同，会被视为不同的元素）
// 
// 深度去重（考虑对象和数组内容）:
// 输入：uniqueDeep([1, 1, '1', '1', true, true, {a: 1}, {a: 1}, [1], [1], null, null, undefined, undefined])
// 输出：[1, '1', true, {a: 1}, [1], null, undefined]

const unique1 = (arr) => [...new Set(arr)]
const unique2 = (arr) => {
  const cache = {}
  const result = []
  for(let i = 0; i <= arr.length; i++) {
    if (!cache[arr[i]]) {
      cache[arr[i]] = arr[i]
      result.push(arr[i])
    }
  }
  return result
}
const unique3 = (arr) => {
  const result = []
  for(let i = 0; i <= arr.length; i++) {
    if (result.indexOf(arr[i] === -1)) {
      result.push(arr[i])
    }
  }
  return result
}
const unique4 = (arr) => {
  const seen = new Map()
  return arr.filter(v => {
    if(!seen.has(v)) {
      seen.set(v, true)
      return true
    }
    return false
  })
}

// 深度去重，判断是不是对象，是的话序列化成字符串

// 题目12：斐波那契数列的实现
// 实现斐波那契数列的计算函数 fibonacci(n)，返回斐波那契数列的第 n 项。
// 斐波那契数列定义：f(0)=0, f(1)=1, f(n)=f(n-1)+f(n-2) (n>=2)
// 要求：
// 1. 使用递归方式实现
// 2. 使用迭代方式实现
// 3. 分析两种实现方式的性能差异
// 4. 尝试使用记忆化搜索等优化方法提高递归性能
// 示例：
// 输入：fibonacci(0)
// 输出：0
// 输入：fibonacci(1)
// 输出：1
// 输入：fibonacci(6)
// 输出：8
// 输入：fibonacci(10)
// 输出：55

// 递归
const cache = {}
const fibonacci1 = (target) => {
  if(target <=1) {
    return target
  }
  if(cache[target]) return cache[target]
  cache[target] = fibonacci1(target-1) + fibonacci1(target-2)
  return cache[target]
}

// 迭代
const fibonacci2 = (target) => {
  const dp = []
  dp[0] = 0
  dp[1] = 1
  for(let i = 2; i <= target; i ++) {
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[target]
}

const a = {
  A: 'B+C',
  B: 'D-C',
  C: 'E/2',
  D: 'E+F',
  E: 'A*2',
  F: 'B-A'
}

const b = {
  A: 4,
  B: 6,
  C: 2
}

// 计算表达式的函数
function calculate(expr, values, calculating = new Set()) {
  // 基础值，直接返回
  if (!isNaN(expr)) {
    return Number(expr);
  }
  
  // 如果是变量，查找其值
  if (values[expr] !== undefined) {
    return values[expr];
  }
  
  // 检测循环依赖
  if (calculating.has(expr)) {
    throw new Error(`循环依赖检测: ${expr}`);
  }
  
  // 如果是表达式，递归计算
  if (a[expr]) {
    calculating.add(expr); // 标记当前正在计算的变量
    
    const formula = a[expr];
    // 使用正则匹配提取操作符和操作数
    const operators = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => a / b
    };
    
    // 查找公式中使用的操作符
    for (const op of Object.keys(operators)) {
      if (formula.includes(op)) {
        const [left, right] = formula.split(op);
        const leftValue = calculate(left, values, new Set(calculating));
        const rightValue = calculate(right, values, new Set(calculating));
        
        // 处理除以零的情况
        if (op === '/' && rightValue === 0) {
          throw new Error('除以零错误');
        }
        
        calculating.delete(expr); // 计算完成，移除标记
        return operators[op](leftValue, rightValue);
      }
    }
    
    calculating.delete(expr); // 计算完成，移除标记
  }
  
  throw new Error(`未知表达式: ${expr}`);
}

// 计算所有变量的值
function calculateAll() {
  const result = {...b};
  let remaining = Object.keys(a).filter(key => result[key] === undefined);
  
  let progress = true;
  // 迭代计算直到所有值都已知或无法继续计算
  while (remaining.length > 0 && progress) {
    progress = false;
    
    const tempRemaining = [...remaining];
    for (const key of tempRemaining) {
      try {
        const value = calculate(key, result);
        // 将计算结果添加到结果中
        result[key] = value;
        // 从remaining中移除已计算的变量
        remaining = remaining.filter(k => k !== key);
        progress = true;
      } catch (e) {
        // 无法计算，继续下一个
        console.log(`无法计算 ${key}: ${e.message}`);
      }
    }
  }
  
  // 检查是否所有变量都已计算
  if (remaining.length > 0) {
    console.log(`无法计算以下变量: ${remaining.join(', ')}`);
  }
  
  return result;
}

// 螺旋打印数组
