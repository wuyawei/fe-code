/* 
run(fetchList, num, callback);
fetchList 接口请求list
num 最大并发数
callback 所有接口返回后，执行callback，并把接口返回值回传
*/
const fetch = (val, time) => {
    return () => new Promise((resolve, reject) => {
        setTimeout(() => {resolve(val)}, time)
    })
}
const fetchList = [fetch(1, 1000), fetch(2, 2500), fetch(3, 1000), fetch(4, 2000), fetch(5, 1000)];
// 1, 3, 2, 5, 4

const run = (list, num = 2, callback) => {
    let index = 0;
    const res = [];
    const excute = () => {
        while(index < 2 && list.length) {
            const fn = list.shift();
            fn().then(r => {
                index--;
                res.push(r);
                if(index === 0 && !list.length) {
                    callback(res);
                }
                excute();
            })
            index++;
        }
    }
    excute();
}

run(fetchList, 2, (result) => {
    console.log("result", result);
    // 1, 3, 2, 5, 4
})