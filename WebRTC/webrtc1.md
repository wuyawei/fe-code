## 前言
  这个主题会作为两期发布，本期主要会讲解 WebRTC 基础 API，并结合相应的练习，尽量让大家在阅读的时候更容易理解。以及1 对 1 通话、和多人通话的基本流程。
  
  
## 什么是 WebRTC ？
  WebRTC 是由一家名为 Gobal IP Solutions，简称 GIPS 的瑞典公司开发的。Google 在 2011 年收购了 GIPS，并将其源代码开源。然后又与 IETF 和 W3C 的相关标准机构合作，以确保行业达成共识。其中：
  * Web Real-Time Communications (WEBRTC) W3C 组织：定义浏览器 API。
  * Real-Time Communication in Web-browsers (RTCWEB) IETF 标准组织：定义其所需的协议，数据，安全性等手段。
  
  简单来说，WebRTC 是一个可以在 Web 应用程序中实现音频，视频和数据的实时通信的开源项目。在实时通信中，音视频的采集和处理是一个很复杂的过程。比如音视频流的编解码、降噪和回声消除等，但是在 WebRTC 中，这一切都交由浏览器的底层封装来完成。我们可以直接拿到优化后的媒体流，然后将其输出到本地屏幕和扬声器，或者转发给其对等端。
  
  WebRTC 的音视频处理引擎：
![](https://user-gold-cdn.xitu.io/2019/3/13/16976878d1a2966c?w=616&h=456&f=png&s=12950)
  
  所以，我们可以在不需要任何第三方插件的情况下，实现一个浏览器到浏览器的点对点（p2p）连接，从而进行音视频实时通信。当然，WebRTC 提供了一些 API 供我们使用，在实时音视频通信的过程中，我们主要用到以下三个：
   * getUserMedia：获取音频和视频流（MediaStream）
   * RTCPeerConnection：点对点通信
   * RTCDataChannel：数据通信
  
## 原理
  想要弄清楚 WebRTC 的实现过程，我们可以从上文提到的 API 入手，了解它的作用，才能知道怎么去用。
### getUserMedia
  getUserMedia 这个 API 大家可能并不陌生，因为常见的 H5 录音等功能就需要用到它，主要就是用来获取设备的媒体流（ MediaStream，下文统一叫 MediaStream ）。它可以接受一个参数 constraints，用来指定需要获取到什么样的媒体流。
``` javascript
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }) // 表示需要同时获取到音频和视频
        .then(stream => {
          // 获取到优化后的媒体流
        })
        .catch(err => {
          // 捕获错误
        });
```
  我们简单看一下获取到的 MediaStream。
  
![](https://user-gold-cdn.xitu.io/2019/3/14/1697afbf32a4ec6f?w=320&h=457&f=png&s=73734)

  可以看到它有很多属性，我们只需要了解一下就好，更多信息可以查阅 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream).
  * id [String]: 对当前的 MS 进行唯一标识。所以每次刷新浏览器或是重新获取 MS，id 都会变动。
  * active [boolean]: 表示当前 MS 是否是活跃状态（就是是否可以播放）。
  * onactive: 当 active 为 true 时，触发该事件。
  
  结合上图，我们顺便复习一下上期讲的原型和原型链。MediaStream 的 `__proto__` 指向它的构造函数所对应的原型对象，在原型对象中又有一个 constructor 属性指向了它所对应的构造函数。也就是说 MediaStream 的构造函数是一个名为 MediaStream 的函数。可能说得有一点绕，对原型还不熟悉的同学，可以去看一下上期文章 [JavaScript 原型和原型链及 canvas 验证码实践](https://juejin.im/post/5c7b524ee51d453ee81877a7)。
  
  继续来看 getUserMedia，`navigator.mediaDevices.getUserMedia` 是新版的 API，旧版的是 `navigator.getUserMedia`。为了避免兼容性问题，我们可以稍微处理一下（其实说到底，现在 WebRTC 的支持率还不算高，有需要的可以选择一些适配器，如 `adapter.js`）。
``` javascript
    // 判断是否有 navigator.mediaDevices，没有赋成空对象
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    
    // 继续判断是否有 navigator.mediaDevices.getUserMedia，没有就采用 navigator.getUserMedia
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = function(prams) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // 兼容获取
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, prams, resolve, reject);
            });
        };
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            let video = document.querySelector('#Rtc');
            if ('srcObject' in video) { // 判断是否支持 srcObject 属性
                video.srcObject = stream;
            } else {
                video.src = window.URL.createObjectURL(stream);
            }
            video.onloadedmetadata = function(e) {
                video.play();
            };
        })
        .catch((err) => { // 捕获错误
            console.error(err.name + ': ' + err.message);
        });
```
## 传送门
如果你看到了这里，且本文对你有一点帮助的话，希望你可以动动小手支持一下作者，感谢🍻。文中如有不对之处，也欢迎大家指出，共勉。
* 文章代码库 [🍹🍰fe-code](https://github.com/wuyawei/fe-code)
* 作者开源作品 [💘🍦🙈Vchat — 从头到脚，撸一个社交聊天系统（vue + node + mongodb）](https://github.com/wuyawei/Vchat)
https://webrtc-demo-arhikpdarr.now.sh