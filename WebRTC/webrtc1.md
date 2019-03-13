## 前言
  这个主题会作为两期发布，本期主要会讲解 WebRTC 基础 API，并结合相应的练习，尽量让大家在阅读的时候更容易理解。以及1 对 1 通话、和多人通话的基本流程。
  
  
## 什么是 WebRTC ？
  WebRTC 是由一家名为 Gobal IP Solutions，简称 GIPS 的瑞典公司开发的。Google 在 2011 年收购了 GIPS，并将其源代码开源。
  
  简单来说，WebRTC 是一个可以在 Web 应用程序中实现音频，视频和数据的实时通信的开源项目。因为现在越来越趋标准化，各大浏览器厂商都相继支持。所以，我们可以在不需要任何第三方插件的情况下，实现一个浏览器到浏览器的点对点（p2p）连接，从而进行音视频实时通信。
  
  在实时通信中，音视频的采集和处理是一个很复杂的过程。比如音视频流的编解码、降噪和回声消除等，但是在 WebRTC 中，这一切都交由浏览器的底层封装来完成。我们可以直接拿到优化后的媒体流，然后将其输出到本地屏幕和扬声器，或者转发给其对等端。
  
  WebRTC 的音视频处理引擎：
![](https://user-gold-cdn.xitu.io/2019/3/13/16976878d1a2966c?w=616&h=456&f=png&s=12950)
## API
   WebRTC 提供了一些 API 供我们使用，在实现音视频通信的过程中，我们主要用到以下三个：
   * MediaStream：获取音频和视频流
   * RTCPeerConnection：点对点通信
   * RTCDataChannel：数据的通信
### MediaStream
## 传送门
如果你看到了这里，且本文对你有一点帮助的话，希望你可以动动小手支持一下作者，感谢🍻。文中如有不对之处，也欢迎大家指出，共勉。
* 文章代码库 [🍹🍰fe-code](https://github.com/wuyawei/fe-code)
* 作者开源作品 [💘🍦🙈Vchat — 从头到脚，撸一个社交聊天系统（vue + node + mongodb）](https://github.com/wuyawei/Vchat)
https://webrtc-demo-arhikpdarr.now.sh