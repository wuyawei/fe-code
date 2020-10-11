/* 
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

 

示例 1：

输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
示例 2：

输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
 

提示：

0 <= nums.length <= 100
0 <= nums[i] <= 400

*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const len = nums.length;
    if(len === 0) return 0;
    const dp = [[]];
    dp[0][0] = nums[0]; // 当前这个偷
    dp[0][1] = 0; // 当前这个不偷
    for(let i = 1; i < len; i++) {
        dp[i] = [];
        dp[i][0] = nums[i] + dp[i-1][1]; // 当前偷的话，上一家必须不偷
        dp[i][1] = Math.max(dp[i-1][0], dp[i-1][1]); // 当前不偷，上一家偷不偷都行
    }
    return Math.max(dp[len - 1][0], dp[len - 1][1]);
};


var rob1 = function(nums) {
    const len = nums.length;
    if(len === 0) return 0;
    const dp = [];
    dp[0] = 0;
    dp[1] = nums[0];
    for(let i = 2; i <= len; i++) {
        // 当前等于上家偷的与当前家+前两家偷得的最大值
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i-1]);
    }
    return dp[len];
};


// 思路同 rob1 只是用变量代替了 dp
var rob2 = function(nums) {
    const len = nums.length;
    let pre = 0, tmp = 0, now = 0;
    for(let i = 0; i < len; i++) {
         pre = tmp;
         tmp = now;
         now = Math.max(now, pre + nums[i]);

    }
    return now;
};