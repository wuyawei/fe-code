/* 
* 同时发送四个异步请求，但是需要顺序执行 1 -> 2 -> 3 -> 4 的返回结果，
* 如果1到了就执行1的回调 ，如果2先到1没到则需要等待1，然后执行1的回调，执行2的回调
*/

const fetch = (time, val) => new Promise((resolve, reject) => {
    setTimeout(resolve, time, val);
})

const queue = [];
let pending = false;
const fetched = (time, callback) => {
    queue.push({
        fetch: fetch(time),
        callback
    })
    if(!pending) {
        pending = true;
        Promise.resolve().then(execute);
    }
    function execute() {
        pending = false;
        let index = 0;
        const eva = (i) => {
            if(!queue[i]) return;
            const _fetch = queue[i].fetch;
            const _callback = queue[i].callback;
            _fetch.then(r => {
                _callback(r);
                eva(++i);
            })
        }
        eva(index)
    }
}

fetched(0, () => {
    console.log(1);
});
fetched(500, () => {
    console.log(2);
});
fetched(0, () => {
    console.log(3);
});
fetched(0, () => {
    console.log(4);
});

// 等待1s 输出 1、2 再等0.5s 输出 3、4