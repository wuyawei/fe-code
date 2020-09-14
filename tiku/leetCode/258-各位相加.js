/* 
给定一个非负整数 num，反复将各个位上的数字相加，直到结果为一位数。

示例:

输入: 38
输出: 2 
解释: 各位相加的过程为：3 + 8 = 11, 1 + 1 = 2。 由于 2 是一位数，所以返回 2。
进阶:
你可以不使用循环或者递归，且在 O(1) 时间复杂度内解决这个问题吗？
 
*/

/**
 * 数学解法
 * 对9取余，整除为9，0为0
 * @param {number} num
 * @return {number}
 */
var addDigits = function(num) {
    return num && ((num % 9) ? (num % 9) : 9) || 0; 
};

/**
 * 循环解法
 * @param {number} num
 * @return {number}
 */
var addDigits1 = function(num) {
    while(num > 9) {
        num = `${num}`.split('').reduce((pre, cur) => pre+ +cur, 0);
    }
    return num;
};


/** 
 * 递归解法
 * @param {number} num
 * @return {number}
 */
var addDigits2 = function(num) {
    if(num < 10) {
        return num;
    }
    return addDigits(`${num}`.split('').reduce((pre, cur) => pre+ +cur, 0));
};
