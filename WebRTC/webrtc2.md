## 前言
笔者之前写过一篇 [【从头到脚】撸一个多人视频聊天 — 前端 WebRTC 实战（一）](https://juejin.im/post/5c3acfa56fb9a049f36254be)，主要讲 WebRTC 的一些基础知识以及单人通话的简单实现。原计划这篇写多人通话的，鉴于有同学留言说想看画板，所以把这篇文章提前了，希望可以给大家提供一些思路。

本期的主要内容，便是实现一个共享画板，还有上期没讲的一个知识点：RTCDataChannel 。介于本次的实现多基于上期的知识点，所以建议不太了解 WebRTC 基础的同学，配合上篇一起看 [传送门](https://juejin.im/post/5c3acfa56fb9a049f36254be)。最近文章的相关示例都集中在一个项目里，截至本期目录如下：

![](https://user-gold-cdn.xitu.io/2019/3/31/169d2ed13466b0b2?w=300&h=322&f=png&s=35919)

  * 本文示例 **源码库** [webrtc-stream](https://github.com/wuyawei/webrtc-stream)
  * **文章仓库** [🍹🍰fe-code](https://github.com/wuyawei/fe-code)
  * 本文[演示地址](https://webrtc-stream-txrdcybqae.now.sh/#/)（建议谷歌查看）

照例先看下本期的实战目标（灵魂画手上线）：实现一个可以两人（基于上期文章的 1 对 1 对等连接）协作作画的画板。是什么概念呢？简单来说就是两个人可以共享一个画板，都可以在上面作画。

![](https://user-gold-cdn.xitu.io/2019/3/31/169d2ee0ab3620fb?w=1200&h=413&f=png&s=58172)
## RTCDataChannel
> 我们先把上期留下的知识点补上，因为今天的栗子也会用到它。

### 介绍
简单来说，RTCDataChannel 就是在点对点连接中建立一个双向的数据通道，从而获得文本、文件等数据的点对点传输能力。它依赖于流控制传输协议（SCTP），`SCTP 是一种传输协议，类似于 TCP 和 UDP，可以直接在 IP 协议之上运行。但是，在 WebRTC 的情况下，SCTP 通过安全的 DTLS 隧道进行隧道传输，该隧道本身在 UDP 之上运行`。 嗯，我是个学渣，对于这段话我也只能说是，看过！大家可以直接 [查看原文](https://hpbn.co/webrtc/)。

另外总的来说 RTCDataChannel 和 WebSocket 很像，只不过 WebSocket 不是 P2P 连接，需要服务器做中转。
### 使用
RTCDataChannel 通过上一期讲过的 RTCPeerConnection 来创建。
``` javascript
// 创建
let Channel = RTCPeerConnection.createDataChannel('messagechannel', options);
// messagechannel 可以看成是给 DataChannel 取的别名，限制是不得超过65,535 字节。
// options 可以设置一些属性，一般默认就好。

// 接收
RTCPeerConnection.ondatachannel = function(event) {
  let channel = event.channel;
}
```
RTCDataChannel 只需要在一端使用 `createDataChannel` 来创建实例，在接收端只需要给 RTCPeerConnection 加上 `ondatachannel` 监听即可。但是有一点需要注意的是，一定要是 **呼叫端** 也就是创建 createOffer 的那端来 `createDataChannel` 创建通道。

RTCDataChannel 的一些属性，更多可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/createDataChannel#RTCDataChannelInit_dictionary)
* label：创建时提到的别名。
* ordered：指发送的消息是否需要按照它们的发送顺序到达目的地（true），或者允许它们无序到达（false）。默认值：true。
* binaryType：是一个 DOMString 类型，表示发送的二进制数据的类型。值为 blob 或  arraybuffer，默认值为 "blob"。
* readyState：表示数据连接的状态：
    * connecting 等待连接，也是创建初始状态。
    * open 连接成功并且运行。
    * closing 连接关闭中，不会接受新的发送任务，但是缓冲队列中的消息还是会被继续发送或者接收。也就是没发送完的会继续发送。
    * closed 连接完全被关闭。
    
前面说 RTCDataChannel 和 WebSocket 很像是真的很像，我们基于上期的本地 1 对 1 连接，简单看一下用法。

这里还是说一下，系列文章就是这点比较麻烦，后面的很多内容都是基于前面的基础的，但是有很多同学又没看过之前的文章。但是我也不能每次都把之前的内容再重复一遍，所以还是强烈建议有需求的同学，结合之前的文章一起看 [传送门](https://juejin.im/post/5c3acfa56fb9a049f36254be)，希望大家理解。

![](https://user-gold-cdn.xitu.io/2019/3/31/169d32e094de6fc5?w=800&h=487&f=png&s=18056)

一个简单的收发消息的功能，我们已经知道了在 **呼叫端** 和 **接收端** 分别拿到 RTCDataChannel 实例，但是还不知道怎么接收和发送消息，现在就来看一下。
``` javascript
// this.peerB 呼叫端 RTCPeerConnection 实例
this.channelB = this.peerB.createDataChannel('messagechannel'); // 创建 Channel
this.channelB.onopen = (event) => { // 监听连接成功
    console.log('channelB onopen', event);
    this.messageOpen = true; // 连接成功后显示消息框
};
this.channelB.onclose = function(event) { // 监听连接关闭
    console.log('channelB onclose', event);
};

// 发送消息
send() {
    this.channelB.send(this.sendText);
    this.sendText = '';
}
```
``` javascript
// this.peerA 接收端 RTCPeerConnection 实例
this.peerA.ondatachannel = (event) => {
    this.channelA = event.channel; // 获取接收端 channel 实例
    this.channelA.onopen = (e) => { // 监听连接成功
        console.log('channelA onopen', e);
    };
    this.channelA.onclose = (e) => { // 监听连接关闭
        console.log('channelA onclose', e);
    };
    this.channelA.onmessage = (e) => { // 监听消息接收
        this.receiveText = e.data; // 接收框显示消息
        console.log('channelA onmessage', e.data);
    };
};
```
建立对等连接的过程这里就省略了，通过这两段代码就可以实现简单的文本传输了。
## 白板演示
### 需求
ok，WebRTC 的三大 API 到这里就讲完了，接下来开始我们今天的第一个实战栗子 — 白板演示。可能有的同学不太了解白板演示，通俗点讲，就是你在白板上写写画画的东西，可以实时的让对方看到。先来看一眼我的大作：

![](https://user-gold-cdn.xitu.io/2019/3/31/169d34570acea89b?w=1235&h=525&f=png&s=17726)

嗯，如上，白板操作会实时展示在演示画面中。其实基于 WebRTC 做白板演示非常简单，因为我们不需要视频通话，所以不需要获取本地媒体流。那我们可以直接把 Canvas 画板作为一路媒体流来建立连接，这样对方就能看到你的画作了。怎么把 Canvas 变成媒体流呢，这里用到了一个神奇的 API：`captureStream`。
``` javascript
this.localstream = this.$refs['canvas'].captureStream();
```
一句话就可以把 Canvas 变成媒体流了，所以演示画面仍然是 video 标签在播放媒体流，只是这次不是从摄像头获取的流，而是 Canvas 转换的。
### 封装 Canvas 类
现在点对点连接我们有了，白板流我们也有了，好像就缺一个能画画的 Canvas 了。说时迟那时快，看，Canvas 来了。