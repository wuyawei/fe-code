## 前言
  【 **从头到脚** 】会作为一个系列文章来发布，它包括但不限于 WebRTC 多人视频，预计会有：
   * WebRTC 实战（一）：也就是本期，主要是基础讲解以及一对一的本地对等连接，网络对等连接。
   * WebRTC 实战（二）：主要讲解数据传输以及多端本地对等连接、网络对等连接。
   * WebRTC 实战（三）：实现一个一对一的视频聊天项目，包括但不限于截图、录制等。
   * WebRTC + Canvas 实现一个共享画板项目。
   * 作者开源作品  [💘🍦🙈Vchat — 一个社交聊天系统（vue + node + mongodb）](https://github.com/wuyawei/Vchat) 的系列文章
  
  因为文章输出确实要耗费很大的精力，所以上面计划不一定是这个发布顺序，中间也会穿插发布其它方向的文章，如 Vue、JavaScript 或者其他学习的主题。在文章里，会把我自己遇到过的一些坑点重点提示大家注意，尽量让大家在学习过程中少走弯路。当然，我的也并不是标准答案，只是我个人的思路。如果大家有更好的方法，可以互相交流，也希望大家都能有所收获。
  
  在这里也希望大家可以 **关注** 一波，你们的关注支持，也能激励我输出更好的文章。
  * 本文示例 **源码库** [webrtc-stream](https://github.com/wuyawei/webrtc-stream)
  * **文章仓库** [🍹🍰fe-code](https://github.com/wuyawei/fe-code)
  * 本文[演示地址](https://webrtc-stream-jukbknonbo.now.sh/#/)（建议谷歌查看）
  
  文章末尾有 **交流群** 和 **公众号**，希望大家支持，感谢🍻。
## 什么是 WebRTC ？
  WebRTC 是由一家名为 Gobal IP Solutions，简称 GIPS 的瑞典公司开发的。Google 在 2011 年收购了 GIPS，并将其源代码开源。然后又与 IETF 和 W3C 的相关标准机构合作，以确保行业达成共识。其中：
  
  * Web Real-Time Communications (WEBRTC) W3C 组织：定义浏览器 API。
  * Real-Time Communication in Web-browsers (RTCWEB) IETF 标准组织：定义其所需的协议，数据，安全性等手段。
  
  简单来说，WebRTC 是一个可以在 Web 应用程序中实现音频，视频和数据的实时通信的开源项目。在实时通信中，音视频的采集和处理是一个很复杂的过程。比如音视频流的编解码、降噪和回声消除等，但是在 WebRTC 中，这一切都交由浏览器的底层封装来完成。我们可以直接拿到优化后的媒体流，然后将其输出到本地屏幕和扬声器，或者转发给其对等端。
  
  WebRTC 的音视频处理引擎：
  
![WebRTC 的音视频处理引擎](https://user-gold-cdn.xitu.io/2019/3/13/16976878d1a2966c?w=616&h=456&f=png&s=12950)
  
  所以，我们可以在不需要任何第三方插件的情况下，实现一个浏览器到浏览器的点对点（P2P）连接，从而进行音视频实时通信。当然，WebRTC 提供了一些 API 供我们使用，在实时音视频通信的过程中，我们主要用到以下三个：
  
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
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }) 
    // 参数表示需要同时获取到音频和视频
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
  
  这里也可以通过 getAudioTracks()、getVideoTracks() 来查看获取到的流的某些信息，更多信息查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack)。

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
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // 兼容获取
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
* constraints

 对于 constraints 约束对象，我们可以用来指定一些和媒体流有关的属性。比如指定是否获取某种流：
``` javascript
    navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    // 只需要视频流，不要音频
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
    // 也可以指定设备 id，
    // 通过 navigator.mediaDevices.enumerateDevices() 可以获取到支持的设备
    { video: { deviceId: myCameraDeviceId } }
```
  还有一个比较有意思的就是设置视频源为屏幕，但是目前只有火狐支持了这个属性。
``` javascript
    { audio: true, video: {mediaSource: 'screen'} } 
```
  这里就不接着做搬运工了，更多精彩尽在 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)，^_^!
### RTCPeerConnection
> RTCPeerConnection 接口代表一个由本地计算机到远端的 WebRTC 连接。该接口提供了创建，保持，监控，关闭连接的方法的实现。—— MDN
  
* 概述
  
    RTCPeerConnection 作为创建点对点连接的 API，是我们实现音视频实时通信的关键。在点对点通信的过程中，需要交换一系列信息，通常这一过程叫做 — 信令（signaling）。在信令阶段需要完成的任务：
  
     * 为每个连接端创建一个 RTCPeerConnection，并添加本地媒体流。
     * 获取并交换本地和远程描述：SDP 格式的本地媒体元数据。
     * 获取并交换网络信息：潜在的连接端点称为 ICE 候选者。
  
  我们虽然把 WebRTC 称之为点对点的连接，但并不代表在实现过程中不需要服务器的参与。相反，在点对点的信道建立起来之前，二者之间是没有办法通信的。这也就意味着，在信令阶段，我们需要一个通信服务来帮助我们建立起这个连接。WebRTC 本身没有指定某一个信令服务，所以，我们可以但不限于使用 XMPP、XHR、Socket 等来做信令交换所需的服务。我在工作中采用的方案是基于 XMPP 协议的`Strophe.js`来做双向通信，但是在本例中则会使用`Socket.io `以及 Koa 来做项目演示。
* NAT 穿越技术

  我们先看连接任务的第一条：为每个连接端创建一个 RTCPeerConnection，并添加本地媒体流。事实上，如果是一般直播模式，则只需要播放端添加本地流进行输出，其他参与者只需要接受流进行观看即可。
  
  因为各浏览器差异，RTCPeerConnection 一样需要加上前缀。
    ``` javascript
        let PeerConnection = window.RTCPeerConnection ||
                             window.mozRTCPeerConnection ||
                             window.webkitRTCPeerConnection;
        let peer = new PeerConnection(iceServers);
    ```
  我们看见 RTCPeerConnection 也同样接收一个参数 — iceServers，先来看看它长什么样：
    ``` javascript
        {
          iceServers: [
            { url: "stun:stun.l.google.com:19302"}, // 谷歌的公共服务
            {
              url: "turn:***",
              username: ***, // 用户名
              credential: *** // 密码
            }
          ]
        }
    ```
  参数配置了两个 url，分别是 STUN 和 TURN，这便是 WebRTC 实现点对点通信的关键，也是一般 P2P 连接都需要解决的问题：NAT穿越。
  
  NAT（Network Address Translation，网络地址转换）简单来说就是为了解决 IPV4 下的 IP 地址匮乏而出现的一种技术，也就是一个 公网 IP 地址一般都对应 n 个内网 IP。这样也就会导致不是同一局域网下的浏览器在尝试 WebRTC 连接时，无法直接拿到对方的公网 IP 也就不能进行通信，所以就需要用到 NAT 穿越（也叫打洞）。以下为 NAT 穿越基本流程：
  
  ![](https://user-gold-cdn.xitu.io/2019/3/16/16984621b1f7f498?w=676&h=434&f=png&s=88128)
  
  一般情况下会采用 ICE 协议框架进行 NAT 穿越，ICE 的全称为 Interactive Connectivity Establishment，即交互式连接建立。它使用 STUN 协议以及 TURN 协议来进行穿越。关于 NAT 穿越的更多信息可以参考  [ICE协议下NAT穿越的实现（STUN&TURN）](https://www.jianshu.com/p/84e8c78ca61d)、[P2P通信标准协议(三)之ICE](https://www.cnblogs.com/pannengzhi/p/5061674.html)。
  
  到这里，我们可以发现，WebRTC 的通信至少需要两种服务配合：
  * 信令阶段需要双向通信服务辅助信息交换。
  * STUN、TURN辅助实现 NAT 穿越。
* 建立点对点连接

  WebRTC 的点对点连接到底是什么样的过程呢，我们通过结合图例来分析连接。

  ![](https://user-gold-cdn.xitu.io/2019/3/15/169810c20bb10132?w=680&h=189&f=png&s=6589)

  显而易见，在上述连接的过程中：
     * **呼叫端**（在这里都是指代浏览器）需要给 **接收端** 发送一条名为 offer 的信息。
     * **接收端** 在接收到请求后，则返回一条 answer 信息给 **呼叫端**。
     
  这便是上述任务之一 ，SDP 格式的本地媒体元数据的交换。sdp 信息一般长这样：
    ``` javascript
        v=0
        o=- 1837933589686018726 2 IN IP4 127.0.0.1
        s=-
        t=0 0
        a=group:BUNDLE audio video
        a=msid-semantic: WMS yvKeJMUSZzvJlAJHn4unfj6q9DMqmb6CrCOT
        m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
        ...
        ...
    ```
  
  但是任务不仅仅是交换，还需要分别保存自己和对方的信息，所以我们再加点料：
  
  ![](https://user-gold-cdn.xitu.io/2019/3/15/169810cd0eb2e77c?w=680&h=280&f=png&s=12173)
  
     * **呼叫端** 创建 offer 信息后，先调用 setLocalDescription 存储本地 offer 描述，再将其发送给 **接收端**。
     * **接收端** 收到 offer 后，先调用 setRemoteDescription 存储远端 offer 描述；然后又创建 answer 信息，同样需要调用 setLocalDescription 存储本地 answer 描述，再返回给 **接收端**
     * **呼叫端** 拿到 answer 后，再次调用 setRemoteDescription 设置远端 answer 描述。
     
  到这里点对点连接还缺一步，也就是网络信息 ICE 候选交换。不过这一步和 offer、answer 信息的交换并没有先后顺序，流程也是一样的。即：在**呼叫端**和**接收端**的 ICE 候选信息准备完成后，进行交换，并互相保存对方的信息，这样就完成了一次连接。
  
  ![](https://user-gold-cdn.xitu.io/2019/3/16/169860e7cf668614?w=904&h=785&f=png&s=75228)

  这张图是我认为比较完善的了，详细的描述了整个连接的过程。正好我们再来小结一下：
     * 基础设施：必要的信令服务和 NAT 穿越服务
     * clientA 和 clientB 分别创建 RTCPeerConnection 并为输出端添加本地媒体流。如果是视频通话类型，则意味着，两端都需要添加媒体流进行输出。
     * 本地 ICE 候选信息采集完成后，通过信令服务进行交换。
     * 呼叫端（好比 A 给 B 打视频电话，A 为呼叫端）发起 offer 信息，接收端接收并返回一个 answer 信息，呼叫端保存，完成连接。
### 本地 1 v 1 对等连接
  基础流程讲完了，那么是骡子是马拉出来溜溜。我们先来实现一个本地的对等连接，借此熟悉一下流程和部分 API。本地连接，意思就是不经过服务，在本地页面的两个 video 之间进行连接。算了，还是上图吧，一看就懂。
  
  ![](https://user-gold-cdn.xitu.io/2019/3/16/16986acdf2e662b0?w=480&h=208&f=gif&s=508424)
  
  明确一下目标，A 作为输出端，需要获取到本地流并添加到自己的 RTCPeerConnection；B 作为呼叫端，并没有输出的需求，因此只需要接收流。
  * 创建媒体流
  
  页面布局很简单，就是两个 video 标签，分别代表 A 和 B。所以我们直接看代码，虽然源码是用 Vue 构建的，但是并没有用到特别的 API，整体上和 es6 的 class 语法相差不大，而且都有详细的注释，所以建议没有 Vue 基础的同学可以直接当成 es6 来阅读。示例 **源码库** [webrtc-stream](https://github.com/wuyawei/webrtc-stream)
  ``` javascrit
    async createMedia() {
        // 保存本地流到全局
        this.localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        let video = document.querySelector('#rtcA');
        video.srcObject = this.localstream;
        this.initPeer(); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
    }
  ```
  * 初始化 RTCPeerConnection
  ``` javascript
    initPeer() {
        ...
        this.peerA.addStream(this.localstream); // 添加本地流
        this.peerA.onicecandidate = (event) => {
        // 监听 A 的ICE候选信息 如果收集到，就添加给 B 连接状态
            if (event.candidate) {
                this.peerB.addIceCandidate(event.candidate);
            }
        };
        ...
        // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
        this.peerB.onaddstream = (event) => {
            let video = document.querySelector('#rtcB');
            video.srcObject = event.stream;
        };
        this.peerB.onicecandidate = (event) => { 连接状态
        // 监听 B 的ICE候选信息 如果收集到，就添加给 A
            if (event.candidate) {
                this.peerA.addIceCandidate(event.candidate);
            }
        };
    }
  ```
  这部分主要就是分别创建 peer 实例，并互相交换 ICE 信息。不过有一个属性需要在这里提一下，就是 iceConnectionState。
  ``` javascript
    peer.oniceconnectionstatechange = (evt) => {
        console.log('ICE connection state change: ' + evt.target.iceConnectionState);
    };
  ```
  我们可以通过 `oniceconnectionstatechange` 方法来监测 ICE 连接的状态，它一共有七种状态：
  ```
new        ICE代理正在收集候选人或等待提供远程候选人。
checking   ICE代理已经在至少一个组件上接收了远程候选者，并且正在检查候选但尚未找到连接。除了检查，它可能还在收集。
connected  ICE代理已找到所有组件的可用连接，但仍在检查其他候选对以查看是否存在更好的连接。它可能还在收集。
completed  ICE代理已完成收集和检查，并找到所有组件的连接。
failed     ICE代理已完成检查所有候选对，但未能找到至少一个组件的连接。可能已找到某些组件的连接。
disconnected ICE 连接断开
closed      ICE代理已关闭，不再响应STUN请求。
  ```
  我们需要注意的是 completed 和 disconnected，一个是完成连接时触发，一个在断开连接时触发。
  * 创建连接
  ``` javascript
    async call() {
        if (!this.peerA || !this.peerB) { // 判断是否有对应实例，没有就重新创建
            this.initPeer();
        }
        try {
            let offer = await this.peerA.createOffer(this.offerOption); // 创建 offer
            await this.onCreateOffer(offer);
        } catch (e) {
            console.log('createOffer: ', e);
        }
    }
  ```
  这里需要判断是否有对应实例，是为了挂断之后又重新呼叫做的处理。
  ``` javascript
    async onCreateOffer(desc) {
        try {
            await this.peerB.setLocalDescription(desc); // 呼叫端设置本地 offer 描述
        } catch (e) {
            console.log('Offer-setLocalDescription: ', e);
        }
        try {
            await this.peerA.setRemoteDescription(desc); // 接收端设置远程 offer 描述
        } catch (e) {
            console.log('Offer-setRemoteDescription: ', e);
        }
        try {
            let answer = await this.peerA.createAnswer(); // 接收端创建 answer
            await this.onCreateAnswer(answer);
        } catch (e) {
            console.log('createAnswer: ', e);
        }
    },
    async onCreateAnswer(desc) {
        try {
            await this.peerA.setLocalDescription(desc); // 接收端设置本地 answer 描述
        } catch (e) {
            console.log('answer-setLocalDescription: ', e);
        }
        try {
            await this.peerB.setRemoteDescription(desc); // 呼叫端端设置远程 answer 描述
        } catch (e) {
            console.log('answer-setRemoteDescription: ', e);
        }
    }
  ```
  这基本就是之前重复过好几次的流程用代码写出来而已，看到这里，思路应该比较清晰了。不过有一点需要说明一下，就是现在这种情况，A 作为呼叫端，B 一样是可以拿到 A 的媒体流的。因为连接一旦建立了，就是双向的，只不过 B 初始化 peer 的时候没有添加本地流，所以 A 不会有 B 的媒体流。
### 网络 1 v 1 对等连接
  想必基本流程大家都已经熟悉了，通过图解、实例来来回回讲了好几遍。所以趁热打铁，我们这次把服务加上，做一个真正的点对点连接。在看下面的文章之前，我希望你有一点点 Koa 和 Scoket.io 的基础，了解一些基本 API 即可。不熟悉的同学也不要紧，现在看也来得及，[Koa](https://koa.bootcss.com/)、[Socke.io](https://www.w3cschool.cn/socket/socket-ulbj2eii.html)，或者可以参考我之前的文章 [Vchat - 一个社交聊天系统（vue + node + mongodb）](https://juejin.im/post/5c0a00fb6fb9a049d4419d3a)。
* 需求

  还是老规矩，先了解一下需求。图片加载慢，可以直接看[演示地址](https://webrtc-stream-txrdcybqae.now.sh/#/)
  
  ![](https://user-gold-cdn.xitu.io/2019/3/17/16989e02332169d9?w=600&h=203&f=png&s=88263)
  
  连接过程涉及到多个环节，这里就不一一截图了，可以直接去演示地址查看。简单分析一下我们要做的事情：
    * 加入房间后，获取到房间的所有在线成员。
    * 选择任一成员进行通话，也就是呼叫动作。这时候就有一些细节问题要处理：不能呼叫自己、同一时刻只允许呼叫一个人且需要判断对方是否是通话中、呼叫后回复需要有相应判断（同意、拒绝以及通话中）
    * 拒绝或通话中，都没有后续动作，可以换个人再呼叫。同意之后，就要开始建立点对点连接。
* 加入房间

  简单看一下加入房间的流程：
  ``` javascript
    // 前端
    join() {
        if (!this.account) return;
        this.isJoin = true; // 输入框弹层逻辑
        window.sessionStorage.account = this.account; // 刷新判断是否登录过
        socket.emit('join', {roomid: this.roomid, account: this.account}); // 发送加入房间请求
    }
    
    // 后端
    const sockS = {}; // 不同客户端对应的 sock 实例
    const users = {}; // 成员列表
    sock.on('join', data=>{
        sock.join(data.roomid, () => {
            if (!users[data.roomid]) {
                users[data.roomid] = [];
            }
            let obj = {
                account: data.account,
                id: sock.id
            };
            let arr = users[data.roomid].filter(v => v.account === data.account);
            if (!arr.length) {
                users[data.roomid].push(obj);
            }
            sockS[data.account] = sock; // 保存不同客户端对应的 sock 实例
             // 将房间内成员列表发给房间内所有人
            app._io.in(data.roomid).emit('joined', users[data.roomid], data.account, sock.id);
        });
    });
  ```
  后端成员列表的处理，是因为做了多房间的逻辑，按每个房间的成员表返回的。你们如果做的时候没有多房间，则不需要这么考虑。sockS 的处理，是为了发送私聊消息。
* 呼叫

  前面已经说了呼叫的注意事项，所以这里就一起来讲。需要注意的就是消息中需要带有自己和对方的 account，因为这是判断成员 sock 的标识，也就是之前存储在 socks 中的用来发私聊消息的。然后是前面说的三种状态，在这里用 type 值 1, 2, 3 来区分，然后给出不同的回复。
  ``` javascript
    // 前端
    apply(account) { // 发送请求
        // account 对方account  self 是自己的account
        this.loading = true;
        this.loadingText = '呼叫中'; // 呼叫中 loading
        socket.emit('apply', {account: account, self: this.account});
    },
    reply(account, type) { // 处理回复
        socket.emit('reply', {account: account, self: this.account, type: type});
    }
    // 收到请求
    socket.on('apply', data => {
        if (this.isCall) { // 判断是否在通话中
            this.reply(data.self, '3');
            return;
        }
        this.$confirm(data.self + ' 向你请求视频通话, 是否同意?', '提示', {
            confirmButtonText: '同意',
            cancelButtonText: '拒绝',
            type: 'warning'
        }).then(async () => {
            this.isCall = data.self;
            this.reply(data.self, '1');
        }).catch(() => {
            this.reply(data.self, '2');
        });
    });
    
    // 后端
    sock.on('apply', data=>{ // 转发申请
        sockS[data.account].emit('apply', data);
    });
  ```
  后端比较简单，仅仅是转发一下请求，给对应的客户端。其实我们这个例子的后端，基本都是这个操作，所以后面的后端代码就不贴了，可以去源码直接看。
* 回复

  回复和和呼叫是一样的逻辑，分别处理不同的回复就好了。
  ``` javascript
    // 前端 
    socket.on('reply', async data =>{ // 收到回复
        this.loading = false;
        switch (data.type) {
            case '1': // 同意
                this.isCall = data.self; // 存储通话对象
                break;
            case '2': //拒绝
                this.$message({
                    message: '对方拒绝了你的请求！',
                    type: 'warning'
                });
                break;
            case '3': // 正在通话中
                this.$message({
                    message: '对方正在通话中！',
                    type: 'warning'
                });
                break;
        }
    });
  ```
* 创建连接

  呼叫和回复的逻辑基本清楚了，那我们继续思考，应该在什么时机创建 P2P 连接呢？我们之前说的，拒绝和通话中都不需要处理，只有同意需要，那就应该在同意请求的位置开始创建。需要注意的是，同意请求有两个地方：一个是你点了同意，另一个是对方知道你点了同意之后。
  
  本例采取的是呼叫方发送 Offer，这个地方一定得注意，只要有一方创建 Offer 就可以了，因为一旦连接就是双向的。
  ``` javascript
    socket.on('apply', data => { // 你点同意的地方
        ...
        this.$confirm(data.self + ' 向你请求视频通话, 是否同意?', '提示', {
            confirmButtonText: '同意',
            cancelButtonText: '拒绝',
            type: 'warning'
        }).then(async () => {
            await this.createP2P(data); // 同意之后创建自己的 peer 等待对方的 offer
            ... // 这里不发 offer
        })
        ...
    });
    socket.on('reply', async data =>{ // 对方知道你点了同意的地方
        switch (data.type) {
            case '1': // 只有这里发 offer
                await this.createP2P(data); // 对方同意之后创建自己的 peer
                this.createOffer(data); // 并给对方发送 offer
                break;
            ...
        }
    });
  ```
  
  和微信等视频通话一样，双方都需要进行媒体流输出，因为你们都要看见对方。所以这里和之前本地对等连接的区别就是都需要给自己的 RTCPeerConnection 实例添加媒体流，然后连接后各自都能拿到对方的视频流。在 初始化 RTCPeerConnection 时，记得加上 onicecandidate 函数，用以给对方发送 ICE 候选。
  ``` javascript
    async createP2P(data) {
        this.loading = true; // loading动画
        this.loadingText = '正在建立通话连接';
        await this.createMedia(data);
    },
    async createMedia(data) {
        ... // 获取并将本地流赋值给 video  同之前
        this.initPeer(data); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
    },
    initPeer(data) {
        // 创建输出端 PeerConnection
        ...
        this.peer.addStream(this.localstream); // 都需要添加本地流
        this.peer.onicecandidate = (event) => {
        // 监听ICE候选信息 如果收集到，就发送给对方
            if (event.candidate) { // 发送 ICE 候选
                socket.emit('1v1ICE',
                {account: data.self, self: this.account, sdp: event.candidate});
            }
        };
        this.peer.onaddstream = (event) => {
        // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src，改变相应loading状态，赋值省略
            this.isToPeer = true;
            this.loading = false;
            ...
        };
    }
  ```
  createOffer 等信息交换和之前一样，只是需要通过 Socket 转发给对应的客户端。然后各自接收到消息后分别采取对应的措施。
  ``` javascript
    socket.on('1v1answer', (data) =>{ // 接收到 answer
        this.onAnswer(data);
    });
    socket.on('1v1ICE', (data) =>{ // 接收到 ICE
        this.onIce(data);
    });
    socket.on('1v1offer', (data) =>{ // 接收到 offer
        this.onOffer(data);
    });
    
    // 这里只贴一个 createOffer 的代码，因为和之前的思路都一样，只是写法有些区别
    // 建议大家都自己敲一遍，有问题可以交流，也可以去源码查看。
    async createOffer(data) { // 创建并发送 offer
        try {
            // 创建offer
            let offer = await this.peer.createOffer(this.offerOption);
            // 呼叫端设置本地 offer 描述
            await this.peer.setLocalDescription(offer);
            // 给对方发送 offer
            socket.emit('1v1offer', {account: data.self, self: this.account, sdp: offer});
        } catch (e) {
            console.log('createOffer: ', e);
        }
    }
  ```
* 挂断

  挂断的思路依然是将各自的 peer 关闭，但是这里挂断方还需要借助 Socket 告诉对方，你已经挂电话了，不然对方还在痴痴地等。
  ``` javascript
    hangup() { // 挂断通话 并做相应处理 对方收到消息后一样需要关闭连接
        socket.emit('1v1hangup', {account: this.isCall, self: this.account});
        this.peer.close();
        this.peer = null;
        this.isToPeer = false;
        this.isCall = false;
    }
  ```
### 下期预告
到这里，这期的内容已经讲完了。这篇文章花了不少时间，周末两天都在写这了，希望你们看完能有所收获。

系列的下一期（ps：系列下一期不一定是文章下一期，写作不易，多多包涵 🍻）主要是讲数据传输以及多端本地对等连接、网络对等连接，因为还有一个重要的 API 没有提到，就是 RTCDataChannel - 数据传输，然后多人视频需要注意的地方也不少。最后，希望大家可以动动小手关注一下，或者扫描下面的公众号二维码，方便第一时间获得最新推送。
## 交流群
> qq前端交流群：960807765，欢迎各种技术交流，期待你的加入

## 后记
  如果你看到了这里，且本文对你有一点帮助的话，希望你可以动动小手支持一下作者，感谢🍻。文中如有不对之处，也欢迎大家指出，共勉。

* 本文示例 **源码库** [webrtc-stream](https://github.com/wuyawei/webrtc-stream)
* **文章仓库** [🍹🍰fe-code](https://github.com/wuyawei/fe-code)

往期文章：
* [JavaScript 原型和原型链及 canvas 验证码实践](https://juejin.im/post/5c7b524ee51d453ee81877a7)
* [站住，你这个Promise！](https://juejin.im/post/5c179aad5188256d9832fb61)
* [💘🍦🙈Vchat — 从头到脚，撸一个社交聊天系统（vue + node + mongodb）](https://juejin.im/post/5c0a00fb6fb9a049d4419d3a)

欢迎关注公众号 **前端发动机**，第一时间获得作者文章推送，还有海量前端大佬优质文章，致力于成为推动前端成长的引擎。
  
![](https://user-gold-cdn.xitu.io/2019/3/16/1698668bd914d63f?w=258&h=258&f=jpeg&s=27979)