/**
 * 回文数
 * @param {number} x 789
 * @return {boolean}
 */

 // 不用字符串解法
var isPalindrome = function(x) {
    if(x<0) return false;
    let target = 0;
    let source = x;
    while(source > 0) {
        target = target * 10 + source % 10;
        source = Math.floor(source / 10);
    }
    return target === x;
};

// 字符串解法
var isPalindrome1 = function(x) {
    x = `${x}`;
    let left = 0;
    let right = x.length - 1;
    while(left < right) {
        if(x[left] !== x[right]) {
            return false;
        }
        left ++;
        right --;
    }
    return true;
};