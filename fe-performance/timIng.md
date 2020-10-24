## http 请求的时间线各个时间指标的优化
* 排队（Queuing）时间过久
排队时间过久，大概率是由浏览器为 **每个域名** 最多维护 6 个连接导致的。
> 可以将资源分布在多个域名下，或者把站点升级到 HTTP2，因为 HTTP2 已经没有每个域名最多维护 6 个 TCP 连接的限制了。
* 第一字节时间（TTFB）时间过久
服务器生成页面数据的时间过久。
网络的原因。
发送请求头时带上了多余的用户信息（服务器处理需要时间）。
> 面对第一种服务器的问题，你可以想办法去提高服务器的处理速度，比如通过增加各种缓存的技术；针对第二种网络问题，你可以使用 CDN 来缓存一些静态文件；至于第三种，你在发送请求时就去尽可能地减少一些不必要的 Cookie 数据信息。
* Content Download 时间过久
单个请求的 Content Download 花费了大量时间，有可能是字节数太多的原因导致的。
> 可以减少文件大小，比如压缩、去掉源码中不必要的注释等方法。
## 性能指标
* 首次内容绘制 (First Contentful Paint, FCP) 
  白屏时间
* 首次有效绘制 (First Meaningful Paint, FMP)
  首屏渲染完成
* 可交互时间 (Time to Interactive, TTI)
  js 等加载完成
## 关键渲染路径
> 优先显示与用户操作相关的内容
## DOMContentLoaded
> 以下 js，默认指 同步加载的情况。且都指代普通脚本，非 ES modules。
* 没有外链 css 和 js 的情况下，DOMContentLoaded 即 html 的加载和解析时间
* 只有外链 css 的时候，会等 css 加载完成并解析成 Cssom，最终和 Dom 树一起生成布局树，不阻塞 Dom 解析，影响 DOMContentLoaded 响应。
* 有外链 css 和 js 的时候，因为 js 可能会操作 dom 及其 css，所以浏览器会等外链 css 加载并解析完后，才会执行 js；所以尽管 js 加载和 css 加载是同时开始的，但就算 js 先下载完，也会被阻塞，而不是立即执行；等 js 执行完，dom 继续解析；
* 只有外链 js 的情况下，js 的加载和执行也会阻塞 dom 的解析。多个 script 标签会并行下载，但是会依次执行。script 只会影响在 它后面的 Dom 解析。script 执行完，Dom 也会重绘或重排。同样也说明浏览器生成 Dom 树，不需要等所有 Dom 解析完成，如果没有 css 阻塞，会优先绘制不受 script 影响的 Dom。
* script 标签设置成 async 时，该 js 的下载不会阻塞 dom 解析，下载完后立即执行，但是也不会影响 DOMContentLoaded 完成。
* script 标签设置成 defer 时，该 js 下载不会阻塞 dom 解析，dom 解析完后执行该 js，js 执行完后，DOMContentLoaded 才会完成。
* 对于 ES modules 模块脚本，默认 defer，如果被设置成 async，该模块及其依赖的所有模块，都将并行下载，并尽快解析和执行。