/**
* Created by wyw on 2019/4/14.
*/
let a = {
    valueOf() {
        console.log(11111);
        return true;
    },
    toString() {
        console.log(222222);
        return 1;
    },
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
};
// let o = {};
console.log(a + 1);
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

