## 前言
React Hooks的基本用法，[官方文档](https://react.docschina.org/docs/hooks-intro.html) 已经非常详细，这里我们通过一个简单的例子详细分析一些令人疑惑的问题及其背后的原理。

**个人博客地址 [🍹🍰 fe-code](https://github.com/wuyawei/fe-code)**

## 问题
> 我们一起来看看这个栗子。

``` javascript
function Counter() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            // console.log(count);
            setCount(count + 1);
        }, 1000);
    }, []);

    return <h1>{count}</h1>;
}
```
我们期望，useEffect 只执行一次，且后续每隔 1s，count 自动 + 1。然而， 实际上 count 从 0 到 1 后，再没有变化，一直都是 1。难道是 setInterval 没执行？于是我们很疑惑的加上了打印。

![image.png](https://i.loli.net/2019/09/10/loHQOmKT9G7buM4.png)

事实是，setInterval 每次执行的时候，拿到的 count 都是 0。很自然的我们会想到闭包，但是闭包能完全解释这个现象吗。我们稍加修改再看下这个例子。

``` javascript
function Counter() {
    const [count, setCount] = useState(0);
    let num = 0;
    useEffect(() => {
        const id = setInterval(() => {
            console.log(num);
            setCount(++num);
        }, 1000);
    }, []);

    return <h1>{count}</h1>;
}
```

![image.png](https://i.loli.net/2019/09/10/7poFOdhnBiKtwTZ.png)

我们可以看到，借助 num 这个中间变量，我们可以得到想要的结果。但是，同样是闭包，为什么 num 就能记住之前的值呢？其实问题出在 count 上，继续往下看：

``` javascript
function Counter() {
    // ...
    console.log('我是 num', num);

    return <h1>{count}-----{num}</h1>;
}
```

![image.png](https://i.loli.net/2019/09/10/mYOcVkM1ASXED8a.png)

到这里我想说的到底是什么呢？我们可以清晰看见渲染到 dom 的 num 和 setInterval 中的 num，完全是不同的。这是因为对于函数式组件来讲，每次更新都会重新执行一遍渲染函数。也就是说，每次更新都会重新声明一个 `num = 0`，所以，定时器中闭包引用的那个 num，和每次更新时渲染的 num，根本不是同一个。当然，我们可以很轻易的把它们变成同一个。

``` javascript
let num = 0; // 将声明放到渲染组件外面
function Counter() {
    // ...
    return <h1>{count}-----{num}</h1>;
}
```

嗯，说了这么多，跟 count 有什么关系呢？同理，正因为函数组件每次都会整体重新执行，那么对于 Hooks 当然也是这样。

``` javascript
function Counter() {
    const [count, setCount] = useState(0);
    // ...
}
```
**useState 应该理解为和普通的 javascript 函数一样，而不是 React 的什么黑魔法**。函数组件更新的时候，useState 会重新执行，对应的，也会重新声明 `[count, setCount]` 这一组常量。只不过 React 对这个函数做了一些特殊处理。比如：首次执行时，会将 useState 的参数初始化给 count，而以后再次执行时，则会直接取上次赋过的值（React 通过某种方式保存起来的）。