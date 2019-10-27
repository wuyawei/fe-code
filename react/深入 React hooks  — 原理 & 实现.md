# 深入 React hooks  — 原理 & 实现
## 前言
React Hooks的基本用法，[官方文档](https://react.docschina.org/docs/hooks-intro.html) 已经非常详细。这是系列的第三篇，探讨一下 hooks 的实现机制。

* [深入 React hooks — useState](https://github.com/wuyawei/fe-code/blob/master/react/%E6%B7%B1%E5%85%A5%20React%20hooks%20%20%E2%80%94%20%20useState.md)
* [深入 React hooks — useEffect](https://github.com/wuyawei/fe-code/blob/master/react/%E6%B7%B1%E5%85%A5%20React%20hooks%20%E2%80%94%20useEffect.md)
* **个人博客地址 [🍹🍰 fe-code](https://github.com/wuyawei/fe-code)**

## useState
前两篇文章已经分析过 useState 和 useEffect 的执行机制，想要更加深入的了解 hooks，可以根据 hooks 的相关特点，自己模拟实现一下相关的函数，也可以直接去看 [源码](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js)。不了解 hook 一些基本特性的同学可以去看文档，或者我的前两篇文章。

useState 是 hooks 方案可以实现的基础，它让我们可以在不依赖 class 的情况下，使组件可以有自己的状态。它的使用很简单：

``` javascript
const [count, setCount] = useState(0);
```

而我们时刻要记住两点：**1、useState 就是一个函数；2、每次更新其实都是触发了它的重执行（之前的文章说过，因为整个函数组件都重执行了）。**

简单点就是下面这样：

``` javascript
function useState(initialState) {
      const state = initialState;
      const setState = newState => state = newState;
      return [state, setState];
}
```
 当然现在是不完整的，因为它根本就不能更新数据。即便我们 setState 的时候，触发了组件更新，再到 useState 更新，最后也只是又一次初始化拿到的 initialState。因为每次 useState 的 state 都是局部变量，更新就等于重新创建了一次，上一次的值始终无法拿到。所以，我们需要把 state 保存起来。
 
 最简单的就是全局变量了，当然 React 并不是这么实现的。对于 hooks，React 采用的是链表，感兴趣的可以自己去看看，这里只是模拟实现一下。
 
 ``` javascript
const HOOKS = []; // 全局的存储 hook 的变量
let currentIndex = 0; // 全局的 依赖 hook 执行顺序的下标
function useState(initialState) {
    HOOKS[currentIndex] = HOOKS[currentIndex] || initialState; // 判断一下是否需要初始化
    const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的，需要保存本次的
    const setState = newState => HOOKS[memoryCurrentIndex] = newState;
    return [HOOKS[currentIndex++], setState]; // 为了多次调用 hook，每次执行 index 需要 +1
}
 ```
 
 我们将所有的 hooks，都保存在一个全局的数组变量中，每次更新时去找对应的下标就好了。**这也是为什么要保证 hooks 的执行顺序在更新前后一致的原因**。试想一下，第一次运行执行了四个 hooks，下标增加到了 3；而更新的时候因为 if 判断等原因，原本的第三个 hook 没有执行，那第四个 hook 取到的值是不是就错了？。
 
 我们再扩展一下，useState 初始化是可以传函数的，setState 也是一样，所以可以稍微加点判断。
 
 ``` javascript
 function useState(initialState) {
    HOOKS[currentIndex] = HOOKS[currentIndex]
        || (typeof initialState === 'function' ? initialState() : initialState);
    const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的，需要保存本次的
    const setState = p => {
        let newState = p;
        // setCount(count => count + 1)  判断这种用法
        if (typeof p === 'function') newState = p(HOOKS[memoryCurrentIndex]);
        // 如果设置前后的值一样，就不更新了
        if (newState === HOOKS[memoryCurrentIndex]) return;
        HOOKS[memoryCurrentIndex] = newState;
    };
    return [HOOKS[currentIndex++], setState];
}
 ```

 ## Tick
 当然，现在还只是简单地更新了对应的 state，并没有通知 render 更新函数，我们可以写个简单的工具。
 
 ``` javascript
const HOOKS = []; // 全局的存储 hook 的变量
let currentIndex = 0; // 全局的 依赖 hook 执行顺序的下标
const Tick = {
  render: null,
  queue: [],
  push: function(task) {
      this.queue.push(task);
  },
  nextTick: function(update) {
      this.push(update);
      Promise.resolve(() => {
          if (this.queue.length) { // 一次循环后，全部出栈，确保单次事件循环不会重复渲染
              this.queue.forEach(f => f()); // 依次执行队列中所有任务
              currentIndex = 0; // 重置计数
              this.queue = []; // 清空队列
              this.render && this.render(); // 更新dom
          }
      }).then(f => f());
  }
};
 ```
 在 React 中，setState 的更新虽然是同步的，但是我们感知不到，至少看起来它异步了。这是因为 React 自己实现了一套事务管理。能力有限，这里就用 Promise 来替代一下，类似于 Vue 中的 nextTick。
 
 ``` javascript
 const setState = p => {
    // ···
    Tick.nextTick(() => {
        HOOKS[memoryCurrentIndex] = newState;
    });
  };
 ```

 ## useEffect
 useEffect 充当了 class 中的生命周期的角色，我们更多地用来通知更新，清理副作用。有了对 useState 的了解，大致原理是一样的。只不过多了一个依赖数组，如果依赖数组中的每一项都和上一次的一样，就不需要更新，反之更新。
 
 ``` javascript
 function useEffect(fn, deps) {
    const hook = HOOKS[currentIndex];
    const _deps = hook && hook._deps;
    // 判断是否传了依赖，没传默认每次更新
    // 判断本次依赖和上次的是否全部一样
    const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
    const memoryCurrentIndex = currentIndex; // currentIndex 是全局可变的
    if (hasChange) {
        const _effect = hook && hook._effect;
        setTimeout(() => {
            // 每次先判断一下有没有上一次的副作用需要卸载
            typeof _effect === 'function' && _effect();
            // 执行本次的
            const ef = fn();
            // 更新effects
            HOOKS[memoryCurrentIndex] = {...HOOKS[memoryCurrentIndex], _effect: ef};
        })
    }
    // 更新依赖
    HOOKS[currentIndex++] = {_deps: deps, _effect: null};
}
 ```
 
可以看到 useEffect 在 HOOKS 中保存了两个值，一个是依赖，一个是副作用，保存的时机和它的执行顺序一致。因为 useEffect 需要在 dom 挂载后再执行，所以用了 setTimeout 简单模拟，React 中不是这样。

## useReducer
useReducer 很好理解，可以看做是对 useState 做了一层包装，让我们可以更直观的去管理状态。先回忆一下它的使用方法：

``` javascript
const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return {total: state.total + 1};
        case 'decrement':
            return {total: state.total - 1};
        default:
            throw new Error();
    }
}
const [state, dispatch] = useReducer(reducer, { count: 0});
// state.count ...
```
也就是，我们其实只需要结合 useState 和 reducer 就好了。

``` javascript
function useReducer(reducer, initialState) {
    const [state, setState] = useState(initialState);
    const update = (state, action) => {
      const result = reducer(state, action);
      setState(result);
    }
    const dispatch = update.bind(null, state);
    return [state, dispatch];
}
```
## useMemo & useCallback
这两个都用通过依赖用来优化提高 React 性能的，针对处理一些消耗大的计算。useMemo 会返回一个值，而 useCallback 会返回一个函数。
### useMemo
``` javascript
function useMemo(fn, deps) {
    const hook = HOOKS[currentIndex];
    const _deps = hook && hook._deps;
    const hasChange = _deps ? !deps.every((v, i) => _deps[i] === v) : true;
    const memo = hasChange ? fn() : hook.memo;
    HOOKS[currentIndex++] = {_deps: deps, memo};
    return memo;
}
```
### useCallback
``` javascript
function useCallback(fn, deps) {
    return useMemo(() => fn, deps);
}
```

## 小结
这次简单的模拟实现了部分的 React hook，大家有兴趣的也可以自己去完善，如果发现有问题的地方，可以在评论指出，我会及时更新。

* 完整代码在这里 [hook.js](https://github.com/wuyawei/fe-code/blob/master/react/hooks.js)
* 使用方法如下：
``` javascript
const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return {total: state.total + 1};
        case 'decrement':
            return {total: state.total - 1};
        default:
            throw new Error();
    }
}
function render() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const time = setInterval(() => {
            setCount(count => count + 1);
        }, 1000)
        // 清除副作用
        return () => {
            clearInterval(time);
        }
    }, [count]);
    document.querySelector('.add').onclick = () => {
        setCount(count + 1);
    };
    document.querySelector('#count').innerHTML = count;
}
// 绑定 render
Tick.render = render;
render();
```
## 参考文章
* [React hooks 是怎么工作的](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)
* [只是数组，不是魔法](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)
* [React hooks 原理](https://github.com/brickspert/blog/issues/26)

## 交流群

>微信群：扫码回复加群。

![mmqrcode1566432627920.png](https://user-gold-cdn.xitu.io/2019/9/15/16d3303fb5ae517d?w=200&h=200&f=jpeg&s=25608)

## 后记
  如果你看到了这里，且本文对你有一点帮助的话，希望你可以动动小手支持一下作者，感谢🍻。文中如有不对之处，也欢迎大家指出，共勉。好了，又耽误大家的时间了，感谢阅读，下次再见！

* **文章仓库** [🍹🍰fe-code](https://github.com/wuyawei/fe-code)

感兴趣的同学可以关注下我的公众号 **前端发动机**，好玩又有料。

![](https://user-gold-cdn.xitu.io/2019/7/21/16c14d1d0f3be11e?w=400&h=400&f=jpeg&s=34646)