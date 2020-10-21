/* 
给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和。

 

提示：

num1 和num2 的长度都小于 5100
num1 和num2 都只包含数字 0-9
num1 和num2 都不包含任何前导零
你不能使用任何內建 BigInteger 库， 也不能直接将输入的字符串转换为整数形式

*/

// 暴躁解法
var addStrings = function(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let step = 0; // 进位数
    let arr = [];
    while(i >= 0 || j >= 0 || step !== 0) {
        let result = 0;
        let a = num1.charAt(i) - 0;
        let b = num2.charAt(j) - 0;
        result = a + b + step;
        step = result / 10 | 0;
        arr.push(result % 10);
        i--;
        j--;
    }
    return arr.reverse().join('');
};
console.log("addStrings", addStrings('98','9'));