import iceServer from './iceServer.json';
class VcRtc {
    constructor(videoContainer, onStatechange) {
        this.peerList = []; // peer 集合
        this.videoContainer = videoContainer; // video容器
        this.localStream = null; // 本地流
        this.StatechangeCall = onStatechange || function() {}; // 监听连接断开回调
    }
    // constraints { audio: true, video: true }
    // dom  '#video' / el
    getUserMedia(dom, constraints = { audio: true, video: {width: 640, height: 480} }) {
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) { // 兼容性处理
            navigator.mediaDevices.getUserMedia = function(prams) {
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, prams, resolve, reject);
                });
            };
        }
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    let video;
                    if (typeof dom === 'string') {
                        video = document.querySelector(dom);
                    } else if (typeof dom === 'object') {
                        video = dom;
                    } else {
                        console.error('ERR: 需要传入dom对象或相应选择器');
                        return;
                    }
                    if ('srcObject' in video) { // 本地流展示
                        video.srcObject = stream;
                    } else {
                        video.src = window.URL.createObjectURL(stream);
                    }
                    this.localStream = stream;
                    video.onloadedmetadata = function(e) {
                        video.play();
                    };
                    resolve(stream);
                })
                .catch((err) => {
                    console.error(err.name + ': ' + err.message);
                    reject(err);
                });
        });
    }
    getPeerConnection(account, callback) { // 创建peer对象 并将每次拿到的流给指定video播放
        let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        // 创建
        let peer = new PeerConnection(iceServer);
        // 向PeerConnection中加入需要发送的流
        peer.addStream(this.localStream);
        // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
        peer.onaddstream = (event) => {
            // console.log('event-stream', event);
            let videos = document.querySelector('#rtc' + account);
            if (videos) {
                videos.srcObject = event.stream;
            } else {
                let div = document.createElement('div');
                let video = document.createElement('video');
                div.classList.add('video-box');
                div.id = 'rtc' + account;
                video.controls = true;
                video.autoplay = 'autoplay';
                video.srcObject = event.stream;
                div.append(video);
                this.videoContainer.append(div);
            }
        };
        // console.log('peer', peer);
        peer.boxid = account; // 给每个peer加上标记
        this.sendIce(peer, callback);
        this.onStatechange(peer, callback);
        this.peerList[account] = peer;
    }
    sendIce(peer, callback) { // 发送ICE候选
        peer.onicecandidate = (event) => {
            console.log('event.target.iceGatheringState', event.target.iceGatheringState);
            // console.log('sendIce', event);
            if (event.candidate) {
                callback(event.candidate);
            }
        };
    }
    onStatechange(peer) { // 监听连接状态
        peer.oniceconnectionstatechange = (evt) => {
            console.log('ICE connection state change: ' + evt.target.iceConnectionState);
            if (evt.target.iceConnectionState === 'disconnected') { // 断开连接后移除对应video
                this.StatechangeCall(peer.boxid); // 通知页面
                this.removeBox(peer.boxid);
            }
        };
    }
    createOffer(peer, callback) { // 创建offer，发送本地session描述，发送offer
        peer.createOffer({
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }).then((desc) => {
            // console.log('send-offer', desc);
            peer.setLocalDescription(desc, () => {
                callback(peer.localDescription);
            });
        });
    }
    onOffer(v, callback) { // 设置远端描述 发送Answer
        // console.log('onOffer', v);
        this.peerList[v.account].setRemoteDescription(v.sdp, () => {
            this.createAnswer(v, callback);
        }, (err) => {
            console.log('onOffer_ERR:', err);
        });
    }
    createAnswer(v, callback) { // 创建Answer， 设置本地描述， 发送Answer
        this.peerList[v.account].createAnswer().then((desc) => {
            // console.log('send-answer', desc);
            this.peerList[v.account].setLocalDescription(desc, () => {
                callback(this.peerList[v.account].localDescription);
            });
        });
    }
    onAnswer(v) { // 收到Answer后 设置远端描述
        // console.log('onAnswer', v);
        this.peerList[v.account].setRemoteDescription(v.sdp, function() {}, (err) => {
            console.log('onAnswer_ERR:', err);
        });
    }
    onCandidate(v) { // 接收ICE候选，建立P2P连接
        // console.log('onCandidate', v);
        if (v.candidate) {
            this.peerList[v.account].addIceCandidate(v.candidate).catch((err) => {
                console.log('onIceCandidate_ERR:', err);
            });
        }
    }
    removeBox(id) { // 移除关闭的video
        let dom = document.querySelector('#rtc' + id);
        this.videoContainer.removeChild(dom);
    }
    destroy() {
        for (let k in this.peerList) { // 销毁与所有页面的连接
            this.peerList[k].close();
            this.peerList[k] = null;
        }
    }
}
export default VcRtc;
