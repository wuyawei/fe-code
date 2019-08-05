# Touchmove 禁止默认滚动带来的思考

## 前言
分享一些实际开发过程中遇到的问题和解决方案，文中如有不对之处，也欢迎大家指出，共勉。！

**个人博客地址 [🍹🍰 fe-code](https://github.com/wuyawei/fe-code)**

## 背景
源于最近的一个移动端走马灯需求，使用 touchmove 事件，来触发走马灯的动画。但是在实际运行时发现，滑动走马灯的时候很容易触发页面自身垂直方向的滚动，如下图

> 注：这里用 `overflow: auto` 模拟走马灯，只做 touchmove 的测试。

![](https://i.loli.net/2019/08/05/HvAeykDIGW5fc8S.gif)

可以看出，在滑动过程中，滑动方向一旦偏向垂直方向，就会触发页面的垂直滚动。

## preventDefault
因为是 touchmove 事件触发的垂直滚动，所以很容易就想到了通过 `e.preventDefault()` 来禁用事件的默认行为，又很容易就改了代码。

``` javascript
function Touch() {
    const startTouchRef = useRef({x: 0, y: 0});
    // 保存初始位置
    function onTouchStart(e) {
        startTouchRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
    // 限制垂直方向上的滚动
    function onTouchMove(e) {
        const y = Math.abs(e.touches[0].pageY - startTouchRef.current.y);
        const x = Math.abs(e.touches[0].pageX - startTouchRef.current.x);
        // 简单判断滑动方向是倾向于 y 还是 x
        // 禁止 x 方向的默认滚动，因为 x 方向的滚动会通过 Touchmove 或者 css 动画 实现
        if (y < x) {
            e.preventDefault();
        }
    }
    return (
        <div onTouchStart={onTouchStart}
             onTouchMove={onTouchMove}>
            // ...
        </div>
    )
}
```

最后很容易得到了一个报错。

![image.png](https://i.loli.net/2019/08/05/5kL679RbMyixpoh.png)

### Passive event listeners

真是人性化的报错，让我们去查看 [https://www.chromestatus.com/features/5093566007214080](https://www.chromestatus.com/features/5093566007214080) 这个 url。

![image.png](https://i.loli.net/2019/08/05/5kL679RbMyixpoh.png)

大意是说：addEventListener 有一个参数 passive 默认是 false，但是在 Chrome 56 的时候 把 touchstart 和 touchmove 的改成了默认 passive: true。
