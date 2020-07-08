# Touchmove 禁止默认滚动的几种方案

## 前言
分享一些实际开发过程中遇到的问题和解决方案，文中如有不对之处，也欢迎大家指出，共勉。！

**个人博客地址 [🍹🍰 fe-code](https://github.com/wuyawei/fe-code)**

## 背景
源于最近的一个移动端走马灯需求，使用 touchmove 事件，来触发走马灯的动画。但是在实际运行时发现，滑动走马灯的时候很容易触发页面自身垂直方向的滚动，如下图

> 注：这里用 `overflow: auto` 模拟走马灯，只做 touchmove 的测试。

![](https://i.loli.net/2019/08/05/HvAeykDIGW5fc8S.gif)

可以看出，在滑动过程中，滑动方向一旦偏向垂直方向，就会触发页面的垂直滚动。

## 方案
### Passive event listeners
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

真是人性化的报错，让我们去查看 [https://www.chromestatus.com/features/5093566007214080](https://www.chromestatus.com/features/5093566007214080) 这个 url。

![1www.png](https://i.loli.net/2019/08/05/jwmeZyPtKuOA4dr.png)

大意是说：addEventListener 有一个参数 passive 默认是 false，但是在 Chrome 56 的时候 把 touchstart 和 touchmove 的改成了默认 `passive: true`。这样，touchmove 事件就不会阻塞页面的滚动。因为在 `passive: false` 的状态下，不管是否需要调用 `e.preventDefault()` 来阻止页面滚动，都需要等到 touchmove 函数执行完毕，页面才会做出反应。

做一个简单的测试。

``` javascript
// 没有阻止页面滚动，仅仅是增加了事件处理的时间
function Touch() {
    const ref = useRef(null);
    function onTouchMove(e) {
        console.time();
        let index = 0;
        for (let i = 0; i< 1000000000; i++) {
            index++;
        }
        console.timeEnd();
    }
    useEffect(() => {
        ref.current.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            ref.current.removeEventListener('touchmove', onTouchMove, { passive: false });
        };
    }, []);
    return (
        <div >
            // ...
        </div>
    )
}
```

![112.gif](https://i.loli.net/2019/08/05/ijDVrJRpq5hfPM2.gif)

每次滑动后页面的响应明显卡顿，因为浏览器需要等 touchmove 执行完才知道是否需要禁止默认滚动。而将 passive 设为 true 后，浏览器将不考虑禁用默认行为的可能性，会立即触发页面行为。

当然，如果确实要阻止默认行为，就像我之前的那个需求一样，就需要手动设置 passive 是 false，然后正常使用 preventDefault 就好。不过，不管是哪种方式，我们都需要优化自己的执行代码，尽量减少时间代码运行时间。否则，还会看到以下警告：

![image.png](https://i.loli.net/2019/08/05/YXlOpWCcg4tPLIj.png)

关于被动事件监听，更多的优化是在移动端，pc 端貌似较少处理。我这里只测试了 mousewheel，在 pc 的 Chrome 74 下，尽管设置成了 `passive: true`，也没有优先触发页面的滚动行为。但是，在移动端模式下，是可以的。大家有兴趣的也可以自己测试一下。

因为 Chrome 56以上才支持 passive，所以在使用时可能需要做一下兼容性测试。代码来自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)。

``` javascript
// 如果触发对 options 取值 passive 的情况，说明支持 passive 属性
var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function() {
      passiveSupported = true;
    }
  });

  window.addEventListener("test", null, options);
} catch(err) {}

someElement.addEventListener("mouseup", handleMouseUp, passiveSupported
                               ? { passive: true } : false);
```
### touch-action
>  用于设置触摸屏用户如何操纵元素的区域(例如，浏览器内置的缩放功能)。 — [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/touch-action)

这是一个 css 属性，简单来说，就是可以通过 css 指定**允许**用户使用的手势操作。

* pan-x 启用单指水平平移手势
* pan-y 启用单指垂直平移手势
* none 禁止操作

其他属性，大家可以去 MDN 自行查阅。结合我们的需求，使用 pan-y 只开启垂直方向的操作，也能做到类似的效果。需要注意的是，设置 touch-action，和我们设置 `passive: false` 再调用 preventDefault 效果是一样的，不会再对允许操作方向上的滑动效果进行优化。

![11122.gif](https://i.loli.net/2019/08/05/JQTAg4ziW9oCuUG.gif)

另外，这个属性也有兼容性问题，在 Safari 上的支持效果并不好，具体查看 [can i use](https://www.caniuse.com/#search=touch-action)。

### overflow
对于元素的禁止滚动，其实我们给他的父元素添加 `overflow: hidden` 也能达到想要的效果。对于整个页面来说，就需要给 html 标签添加 overflow: hidden。但是，基于当前这个需求场景，因为只是希望在水平滑动时不触发垂直方向的滚动，所以需要判断什么时候设置属性，什么时候移除属性。

这里我没有具体去做这个测试，只是提供一种思路。

## 后记
  如果你看到了这里，且本文对你有一点帮助的话，希望你可以动动小手支持一下作者，感谢🍻。文中如有不对之处，也欢迎大家指出，共勉。好了，又耽误大家的时间了，感谢阅读，下次再见！

* **文章仓库** [🍹🍰fe-code](https://github.com/wuyawei/fe-code)
* **[社交聊天系统（vue + node + mongodb）- 💘🍦🙈Vchat](https://github.com/wuyawei/Vchat)**

## 公众号
感兴趣的同学可以关注下我的公众号 **前端发动机**，好玩又有料。

![](https://user-gold-cdn.xitu.io/2019/7/21/16c14d1d0f3be11e?w=400&h=400&f=jpeg&s=34646)

## 交流群

> 微信群请加我微信，回复加群

![](https://raw.githubusercontent.com/wuyawei/fe-code/master/user.jpg)