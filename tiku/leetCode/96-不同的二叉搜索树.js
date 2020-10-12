/* 
给定一个整数 n，求以 1 ... n 为节点组成的二叉搜索树有多少种？

示例:

输入: 3
输出: 5
解释:
给定 n = 3, 一共有 5 种不同结构的二叉搜索树:

   1         3     3      2      1
    \       /     /      / \      \
     3     2     1      1   3      2
    /     /       \                 \
   2     1         2                 3

*/

/**
 * @param {number} n
 * @return {number}
 * 根节点为i，左子树+右子树
 * dp[0]*dp[i-1] + dp[1]*dp[i-2] + ... + dp[i-1] * dp[0]
 */
var numTrees = function(n) {
    const dp = new Array(n+1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    for(let i = 2; i <= n; i++) {
        // j是左子树
        // 单个 dp[i] = dp[j] * dp[i - 1 - j];
        // 最后需要累加当前 i 所有的dp[i];
        for(let j = 0; j <= i - 1; j++) {
            dp[i] += dp[j] * dp[i - 1 - j];
        }
    }
    return dp[n];
};


// 卡塔兰数 公式
// C0=1, Cn+1=(2*(2n+1))/(n+2)*Cn

var numTrees1 = function(n) {
    let c = 1;
    for(let i = 0; i < n; i++) {
        c = 2 * (2 * i + 1) / (i + 2) * c
    }
    return c;
};
​	