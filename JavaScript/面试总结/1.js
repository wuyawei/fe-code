/**
* Created by wyw on 2019/4/14.
*/
// let a = {
//     valueOf() {
//         console.log(11111);
//         return true;
//     },
//     toString() {
//         console.log(222222);
//         return 1;
//     },
    // [Symbol.toPrimitive](hint) {
    //     if(hint === 'number'){
    //         return 3;
    //     }
    //     if(hint === 'string'){
    //         return '5';
    //     }
    //     if(hint === 'default'){
    //         return 'default';
    //     }
    // }
// };
// let o = {};
// console.log(a + 1);
// let b = function () {};
// b.valueOf = function () {
//     return 0;
// };
// b.toString = function () {
//     return 1;
// };
// // 不加 Symbol.toPrimitive 情况
// console.log(a > 0, b > 0); // false  false
// console.log(a + 1, b + 1); // 1 1
// console.log(a * 1, b * 1); // 0 0
// console.log(a + '1', b + '1'); // 01 01
//
// // 增加 Symbol.toPrimitive， 优先级最高，default 表示没有指定，转成数字、字符串都可以
// console.log(a > 0, b > 0); // true  false  // 转成数字
// console.log(a + 1, b + 1); // default1  1
// console.log(a * 1, b * 1); // 3 0 // 转成数字
// console.log(a + '1', b + '1'); // default1 01

// function sleep(n) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, n);
//     })
// }
//
// async function test() {
//     await sleep(2000);
//     console.log('ok');
// }
// test();

// 冒泡
// function bubbleSort(arr) {
//     console.time('冒泡排序耗时');
//     var len = arr.length;
//     for (var i = 0; i < len-1; i++) {
//         for (var j = 0; j < len - 1 - i; j++) {
//             if (arr[j] > arr[j+1]) {       //相邻元素两两对比
//                 var temp = arr[j+1];      //元素交换
//                 arr[j+1] = arr[j];
//                 arr[j] = temp;
//             }
//         }
//         console.log(arr);
//     }
//     console.timeEnd('冒泡排序耗时');
//     return arr;
// }

// function bubbleSort2(arr) {
//     console.time('改进后冒泡排序耗时');
//     var i = arr.length-1;  //初始时,最后位置保持不变
//     while ( i> 0) {
//         var pos= 0; //每趟开始时,无记录交换
//         for (var j= 0; j< i; j++) {
//             if (arr[j]> arr[j+1]) {
//                 pos= j; //记录交换的位置
//                 // var tmp = arr[j]; arr[j]=arr[j+1];arr[j+1]=tmp;
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//             }
//         }
//         // i--;
//         i= pos; //为下一趟排序作准备
//     }
//     console.timeEnd('改进后冒泡排序耗时');
//     return arr;
// }
// let arr=[5,1,2,3,4];
// console.log(bubbleSort2(arr));
// let a = 1, b = 2;
// [a, b] = [b, a];
// console.log(a, b);

// 选择
// function selectSort(arr) {
//     let i = arr.length -1;
//     while (i > 0) {
//         let index = i;
//         for(let j = 0; j < i; j ++) {
//             if (arr[j] > arr[index]) {
//                 index = j;
//             }
//         }
//         var temp = arr[index];
//         arr[index] = arr[i];
//         arr[i] = temp;
//         i--;
//     }
//     return arr;
// }

// 插入
// function insertSort(arr) {
//     let len = arr.length;
//     for(let i = 1; i < len; i ++) {
//         let k = arr[i];
//         let index = i -1;
//         while (index >= 0 && arr[index] > k) {
//             arr[index + 1] = arr[index];
//             index --;
//         }
//         arr[index + 1] = k;
//     }
//     return arr;
// }

// 二分法插入
// function binaryInsertSort(arr) {
//     var len =arr.length;
//     for (var i=1;i<len; i++) {
//         var key=arr[i],left=0,right=i-1;
//         while(left<=right){      //在已排序的元素中二分查找第一个比它大的值
//             var mid= parseInt((left+right)/2); //二分查找的中间值
//             if(key<arr[mid]){ //当前值比中间值小  则在左边的子数组中继续寻找
//                 right = mid-1;
//             }else{
//                 left=mid+1;//当前值比中间值大   在右边的子数组继续寻找
//             }
//         }
//         for(var j=i-1;j>=left;j--) { // left 之后的成员都向后移动一位
//             arr[j+1]=arr[j];
//         }
//         arr[left]=key;
//     }
//     return arr;
// }

// 快排
// function quickSort(arr) {
//     if (arr.length < 2) {
//         return arr;
//     }
//     let left = [];
//     let right = [];
//     let index = Math.floor(arr.length/2);
//     let point = arr.splice(index, 1)[0];
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] < point) {
//             left.push(arr[i]);
//         } else {
//             right.push(arr[i]);
//         }
//     }
//     return quickSort(left).concat([point], quickSort(right));
// }
// let arr=[5,1,2,3,4];
// console.log(quickSort(arr));