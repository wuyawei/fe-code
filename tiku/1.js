// 实现一个forEach
// let arr = [3, 2, 1];
// Array.prototype.foreach = function (callback) {
//     let index = 0;
//     let arr = this.valueOf();
//     while (index < arr.length) {
//         callback(arr[index], index);
//         index ++;
//     }
// };
// arr.foreach((v, i) => {
//     console.log(v, i);
// });
// 支持异步的forEach
let arr = [3, 2, 1];
// Array.prototype.foreach = async function (callback) {
//     let index = 0;
//     let arr = this.valueOf();
//     let values = this.values();
//     for (let o of values) {
//         await callback(arr[index], index);
//         index ++;
//     }
// };

// 或者
Array.prototype.foreach = async function (callback) {
    let index = 0;
    let arr = this.valueOf();
    while (index < arr.length) {
        await callback(arr[index], index);
        index ++;
    }
};

function fetch(t) {
    return new Promise((resolve, reject) => {
        setTimeout(_ => {
            console.log(t);
            resolve(t);
        }, t * 1000)
    })
}
arr.foreach(async v => {
    // await fetch(v);
    console.log(v);
});