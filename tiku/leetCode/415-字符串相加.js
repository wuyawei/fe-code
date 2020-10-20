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
    let len1 = num1.length;
    let len2 = num2.length;
    let index = len2+len1-1;
    let arr = new Array(len2+len1).fill(0);
    while(len1 - 1 >= 0 && len2 - 1 >= 0) {
        arr[index] = Number(num1[len1-1]) + Number(num2[len2 - 1]);
        len2--;
        len1--;
        index--;
    }
    while(len1 - 1 >= 0) {
        arr[index--] = Number(num1[len1 - 1]);
        len1--;
    }
    while(len2 - 1 >= 0) {
        arr[index--] = Number(num2[len2 - 1]);
        len2--;
    }
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
    while(arr[0] === 0 && arr.length > 1) {
       arr = arr.slice(1);
    }
    return arr.join('');
};
console.log("addStrings('9','99')", addStrings('98','9'));