## 前言
  这个主题会作为两期发布，本期主要会讲解 WebRTC 基础 API，并结合相应的练习，尽量让大家在阅读的时候更容易理解。以及1 对 1 通话、和多人通话的基本流程。
  
  
## 什么是 WebRTC ？
  WebRTC 是由一家名为 Gobal IP Solutions，简称 GIPS 的瑞典公司开发的。Google 在 2011 年收购了 GIPS，并将其源代码开源。然后又与 IETF 和 W3C 的相关标准机构合作，以确保行业达成共识。其中：
  
  * Web Real-Time Communications (WEBRTC) W3C 组织：定义浏览器 API。
  * Real-Time Communication in Web-browsers (RTCWEB) IETF 标准组织：定义其所需的协议，数据，安全性等手段。
  
  简单来说，WebRTC 是一个可以在 Web 应用程序中实现音频，视频和数据的实时通信的开源项目。在实时通信中，音视频的采集和处理是一个很复杂的过程。比如音视频流的编解码、降噪和回声消除等，但是在 WebRTC 中，这一切都交由浏览器的底层封装来完成。我们可以直接拿到优化后的媒体流，然后将其输出到本地屏幕和扬声器，或者转发给其对等端。
  
  WebRTC 的音视频处理引擎：
![WebRTC 的音视频处理引擎](https://user-gold-cdn.xitu.io/2019/3/13/16976878d1a2966c?w=616&h=456&f=png&s=12950)
  
  所以，我们可以在不需要任何第三方插件的情况下，实现一个浏览器到浏览器的点对点（p2p）连接，从而进行音视频实时通信。当然，WebRTC 提供了一些 API 供我们使用，在实时音视频通信的过程中，我们主要用到以下三个：
  
   * getUserMedia：获取音频和视频流（MediaStream）
   * RTCPeerConnection：点对点通信
   * RTCDataChannel：数据通信
   
  不过，虽然浏览器给我们解决了大部分音视频处理问题，但是从浏览器请求音频和视频时，我们还是需要特别注意流的大小和质量。因为即便硬件能够捕获高清质量流，CPU 和带宽也不一定可以跟上，这也是我们在建立多个对等连接时，不得不考虑的问题。
  
## 实现
  接下来，我们通过分析上文提到的 API，来逐步弄懂 WebRTC 实时通信实现的流程。
### getUserMedia
* MediaStream

 getUserMedia 这个 API 大家可能并不陌生，因为常见的 H5 录音等功能就需要用到它，主要就是用来获取设备的媒体流（即 MediaStream）。它可以接受一个约束对象 constraints 作为参数，用来指定需要获取到什么样的媒体流。
``` javascript
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }) // 表示需要同时获取到音频和视频
        .then(stream => {
          // 获取到优化后的媒体流
          let video = document.querySelector('#rtc');
          video.srcObject = stream;
        })
        .catch(err => {
          // 捕获错误
        });
```
  我们简单看一下获取到的 MediaStream。
  
![](https://user-gold-cdn.xitu.io/2019/3/14/1697afbf32a4ec6f?w=320&h=457&f=png&s=73734)

  可以看到它有很多属性，我们只需要了解一下就好，更多信息可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)。
  
    * id [String]: 对当前的 MS 进行唯一标识。所以每次刷新浏览器或是重新获取 MS，id 都会变动。
    * active [boolean]: 表示当前 MS 是否是活跃状态（就是是否可以播放）。
    * onactive: 当 active 为 true 时，触发该事件。
  
  结合上图，我们顺便复习一下上期讲的原型和原型链。MediaStream 的 `__proto__` 指向它的构造函数所对应的原型对象，在原型对象中又有一个 constructor 属性指向了它所对应的构造函数。也就是说 MediaStream 的构造函数是一个名为 MediaStream 的函数。可能说得有一点绕，对原型还不熟悉的同学，可以去看一下上期文章 [JavaScript 原型和原型链及 canvas 验证码实践](https://juejin.im/post/5c7b524ee51d453ee81877a7)。
  
  也可以通过 getAudioTracks()、getVideoTracks() 来查看获取到的流的某些信息，更多信息查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack)。

  ![](https://user-gold-cdn.xitu.io/2019/3/14/1697b85bb19a0658?w=600&h=196&f=png&s=47157)
  
    * kind: 是当前获取的媒体流类型（Audio/Video）。
    * label: 是媒体设备，我这里用的是虚拟摄像头。
    * muted: 表示媒体轨道是否静音。
* 兼容性

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
* API

 对于 constraints 约束对象，我们可以用来指定一些和媒体流有关的属性。比如指定是否获取某种流：
``` javascript
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }); // 只需要视频流，不要音频
```
指定视频流的宽高、帧率以及理想值：
``` javascript
    // 获取指定宽高，这里需要注意：在改变视频流的宽高时，
    // 如果宽高比和采集到的不一样，会直接截掉某部分
    { audio: false, 
      video: { width: 1280, height: 720 } 
    }
    // 设定理想值、最大值、最小值
    {
      audio: true,
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 776, ideal: 720, max: 1080 }
      }
    }
```
  对于移动设备来说，还可以指定获取前摄像头，或者后置摄像头：
``` javascript
    { audio: true, video: { facingMode: "user" } } // 前置
    { audio: true, video: { facingMode: { exact: "environment" } } } // 后置
```
  还有一个比较有意思的就是设置视频源为屏幕，但是目前只有火狐支持了这个属性。
``` javascript
    { audio: true, video: {mediaSource: 'screen'} } 
```
  这里就不接着做搬运工了，更多精彩尽在 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)，^_^!
### RTCPeerConnection
* 概述
  
  RTCPeerConnection 作为创建点对点连接的 API，是我们实现音视频实时通信的关键。在点对点通信的过程中，需要交换一系列信息，通常这一过程叫做 — 信令（signaling）。在信令阶段需要完成的任务：
  
     * 为每个连接端创建一个 RTCPeerConnection，并添加本地流。
     * 获取并交换本地和远程描述：SDP 格式的本地媒体元数据。
     * 获取并交换网络信息：潜在的连接端点称为 ICE 候选者。
  
  我们虽然把 WebRTC 称之为点对点的连接，但并不意味着，实现过程中不需要服务器的参与。因为在点对点的信道建立起来之前，二者之间是没有办法通信的。这也就意味着，在信令阶段，我们需要一个通信服务来帮助我们建立起这个连接。WebRTC 本身没有指定信令服务，所以，我们可以但不限于使用 XMPP、XHR、Socket 等来做信令交换所需的服务。我在工作中采用的方案是基于 XMPP 协议的`Strophe.js`来做双向通信，但是在本例中则会使用`Socket.io `以及 Koa 来做项目演示。
* 建立点对点连接

  我们先看连接任务的第一条：为每个连接端创建一个 RTCPeerConnection，并添加本地流。事实上，如果是一般直播模式，则只需要播放端添加本地流进行输出，其他参与者只需要接受流进行观看即可。
  
  因为各浏览器差异，RTCPeerConnection 一样需要加上前缀。
``` javascript
    let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    
    let peer = new PeerConnection(iceServer);
```
  我们看见 RTCPeerConnection 也同样接收一个参数 — iceServer，来看看它长什么样：
  
  我们通过结合图示来分析连接的过程。

  ![](https://user-gold-cdn.xitu.io/2019/3/15/169810c20bb10132?w=680&h=189&f=png&s=6589)

  显而易见，在上述连接的过程中，请求方（在这里都是指代浏览器）需要给 接收方 发送一条名为 offer 的信息，接收方 在接收到请求后，则返回一条 answer 信息给 请求方。这便是上述任务之一 ，SDP 格式的本地媒体元数据的交换。但是任务不仅仅是交换，还需要分别保存自己和对方的信息，所以我们再加点料：
  
  ![](https://user-gold-cdn.xitu.io/2019/3/15/169810cd0eb2e77c?w=680&h=280&f=png&s=12173)
  
     * 请求方 创建 offer 信息后，先调用 setLocalDescription 存储本地 offer 描述，再将其发送给 接收方。
     * 接收方 收到 offer 后，先调用 setRemoteDescription 存储远端 offer 描述；然后又创建 answer 信息，同样需要调用 setLocalDescription 存储本地 answer 描述，再返回给 请求方
     * 请求方 拿到 answer 后，再次调用 setRemoteDescription 设置远端 answer 描述。

## 后记
如果你看到了这里，且本文对你有一点帮助的话，希望你可以动动小手支持一下作者，感谢🍻。文中如有不对之处，也欢迎大家指出，共勉。
* 文章代码库 [🍹🍰fe-code](https://github.com/wuyawei/fe-code)
* 作者开源作品 [💘🍦🙈Vchat — 从头到脚，撸一个社交聊天系统（vue + node + mongodb）](https://github.com/wuyawei/Vchat)
https://webrtc-demo-arhikpdarr.now.sh