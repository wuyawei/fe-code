## 前言
这是 WebRTC 系列的第三篇文章，主要讲多人点对点对等连接。如果你对 WebRTC 还不太了解，推荐阅读我之前的文章。
* [WebRTC 基础及 1 v 1 对等连接](https://juejin.im/post/5c3acfa56fb9a049f36254be)
* [WebRTC 实战之共享画板](https://juejin.im/post/5c9cbbb85188251c3a2f36e8)

**文章仓库在 [🍹🍰 fe-code](https://github.com/wuyawei/fe-code)，欢迎 star**。

**源码地址 [webrtc-stream](https://github.com/wuyawei/webrtc-stream)**

**线上预览 [https://github.com/wuyawei/webrtc-stream](https://github.com/wuyawei/webrtc-stream)**
## 多路连接
我们之前写过几个 1 v 1 的栗子，它的连接模式如下：

![](https://user-gold-cdn.xitu.io/2019/4/23/16a4a8112f78c458?w=154&h=348&f=png&s=2982)