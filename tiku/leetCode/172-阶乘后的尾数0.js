/* 
给定一个整数 n，返回 n! 结果尾数中零的数量。

示例 1:

输入: 3
输出: 0
解释: 3! = 6, 尾数中没有零。
示例 2:

输入: 5
输出: 1
解释: 5! = 120, 尾数中有 1 个零.
说明: 你算法的时间复杂度应为 O(log n) 。

// 2*5 或者 2和5的倍数 乘积有0
// 换言之 有多少5的倍数 就有多少 0
// 求n的阶乘中，5的倍数出现了多少次
// 22! 中 5、10、15、20
// 30! 中 5、10、15、20、25、30，30整除5后倍数6也大于5，会多一个0

/**
 * @param {number} n
 * @return {number}
 */
var trailingZeroes = function(n) {
    let index = 0;
    while(n >= 5) {
        index += n / 5 | 0;
        n /= 5;
    }
    return index;
};

 
/**
 * @param {number} n
 * @return {number}
 */
// 错误解法  数字太大后无法计算且 复杂度高
var trailingZeroes111 = function(n) {
    if(n < 1) return 0;
    let multiplyNum = 1;
    for(let i = 2; i <= n; i++){
        multiplyNum *= i;
    }
    let index = 0;
    while(multiplyNum % 10 === 0) {
        multiplyNum /= 10;
        index ++;
    }
    return index;
};