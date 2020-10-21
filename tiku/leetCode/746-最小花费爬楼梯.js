/* 
数组的每个索引作为一个阶梯，第 i个阶梯对应着一个非负数的体力花费值 cost[i](索引从0开始)。

每当你爬上一个阶梯你都要花费对应的体力花费值，然后你可以选择继续爬一个阶梯或者爬两个阶梯。

您需要找到达到楼层顶部的最低花费。在开始时，你可以选择从索引为 0 或 1 的元素作为初始阶梯。

示例 1:

输入: cost = [10, 15, 20]
输出: 15
解释: 最低花费是从cost[1]开始，然后走两步即可到阶梯顶，一共花费15。
 示例 2:

输入: cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
输出: 6
解释: 最低花费方式是从cost[0]开始，逐个经过那些1，跳过cost[3]，一共花费6。
注意：

cost 的长度将会在 [2, 1000]。
每一个 cost[i] 将会是一个Integer类型，范围为 [0, 999]。
 
*/

/**
 * @param {number[]} cost
 * @return {number}
 * 动态规划
 * 爬到第i级台阶的最小花费，等于爬到前1级或前2级的最小花费中最小的那个再加本级花费 cost[i]
 * 第一级 dp[0] 有一种情况 cost[0]
 * 第二级 有两种，可以从0到1，也可以直接1；
 * 即 dp[1] = Math.min(cost[0]+cost[1], 0 + cost[1]) = cost[1]； 因为是非负整数；
 * 所以转移方程 dp[i] = Math.min(dp[i-1], dp[i-2]) + cost[i];
 * 根据题意，爬到第n级（下标为 n），也就是最后一级台阶时，不花费
 * 所以 if(i === n) {
            dp[i] = Math.min(dp[i-1], dp[i-2]);
        }
 */
var minCostClimbingStairs = function(cost) {
    const n = cost.length;
    const dp = [];
    dp[0] = cost[0];
    dp[1] = cost[1];
    for(let i = 2; i <= n; i++) {
        if(i === n) {
            dp[i] = Math.min(dp[i-1], dp[i-2]);
        } else {
            dp[i] = Math.min(dp[i-1], dp[i-2]) + cost[i];
        }
    }
    return dp[n];
};

/**
 * @param {number[]} cost
 * @return {number}
 * 同理
 */
var minCostClimbingStairs1 = function(cost) {
    cost.push(0);
    const n = cost.length;
    const dp = [];
    dp[0] = cost[0];
    dp[1] = cost[1];
    for(let i = 2; i < n; i++) {
        dp[i] = Math.min(dp[i-1], dp[i-2]) + cost[i]; 
    }
    return dp[n-1];
};

/**
 * @param {number[]} cost
 * @return {number}
 * 同理
 */
var minCostClimbingStairs2 = function(cost) {
    const n = cost.length;
    const dp = [];
    dp[0] = cost[0];
    dp[1] = cost[1];
    for(let i = 2; i <= n; i++) { 
        dp[i] = Math.min(dp[i-1], dp[i-2]) + (cost[i] || 0); 
    }
    return dp[n];
};


/**
 * @param {number[]} cost
 * @return {number}
 * 不停地将前1和前2的最小值更新保存
 * 前面说过
 * 根据题意，爬到第n级，也就是最后一级台阶时，不花费
 * 所以 if(i === n) {
            dp[i] = Math.min(dp[i-1], dp[i-2]);
        }
    所以 dp[n] = Math.min(dp[n-1], dp[n-2]);
    即 Math.min(n2, n1);
 */
var minCostClimbingStairs3 = function(cost) {
    const n = cost.length;
    n1 = cost[0];
    n2 = cost[1];
    for(let i = 2; i < n; i++) { 
        [n1, n2] = [n2, Math.min(n1, n2) + cost[i]]; 
    }
    return Math.min(n1, n2);
};