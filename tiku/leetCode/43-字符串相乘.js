/* 
给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。

示例 1:

输入: num1 = "2", num2 = "3"
输出: "6"
示例 2:

输入: num1 = "123", num2 = "456"
输出: "56088"
说明：

num1 和 num2 的长度小于110。
num1 和 num2 只包含数字 0-9。
num1 和 num2 均不以零开头，除非是数字 0 本身。
不能使用任何标准库的大数类型（比如 BigInteger）或直接将输入转换为整数来处理。
*/

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
    if(num1 === '0' || num2 === '0') return '0';
    const len1 = num1.length;
    const len2 = num2.length;
    let arr = new Array(len1 + len2).fill(0);
    for(let i = len1-1; i >= 0; i--) {
        for(let j = len2-1; j >= 0; j--) {
            // 相乘后与之前的乘积相加
            arr[i+j+1] = num1[i] * num2[j] + arr[i+j+1]; 
            console.log("multiply -> arr[i+j+1]", arr[i+j+1]);
        }
    } 
    console.log("multiply -> arr", arr)
    let step = 0; // 进位数
    for(let i = arr.length - 1; i >=0; i--) {
        // 求进
        arr[i] = arr[i] + step;
        // 计算下一个进位
        step = arr[i] / 10 | 0; 
        // 保存余数
        arr[i] = arr[i] % 10; 
    }
    // 首位不能是0
    if(arr[0] === 0) {
       arr = arr.slice(1);
    }
    return arr.join('');
};
// console.log("multiply([9,9,9], [9,9,9])", multiply('999', '999'));

