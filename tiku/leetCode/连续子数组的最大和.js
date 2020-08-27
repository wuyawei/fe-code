/* 
输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

要求时间复杂度为O(n)。

示例1:

输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
 

提示：

1 <= arr.length <= 10^5
-100 <= arr[i] <= 100

*/


// 假定 list[j] ~ list[k] 最大
// 那么 list[k]的累加 - list[j] 的累加，就等于 list[j] ~ list[k]
// 且 list[j] 的累加 必定是 list[k]的累加过程中的 最小值
function LSS(list) {
    const len = list.length;
    let max = list[0];
    let min = 0;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += list[i];
      if (sum - min > max) max = sum - min;
      if (sum < min) {
        min = sum;
      }
    }
  
    return max;
}
// console.log(LSS([-2,-3,1,4]))
// console.log(LSS([1,-2,-3,4]))
// console.log(LSS([-2,1,4,-3]))


// 暴力解法
function LSS1(nums) {
    const len = nums.length;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < len; i++) {
        let sum = 0;
        for (let j = i; j < len; j++) {
            sum += nums[j];
            max = Math.max(sum, max);
        }
    }
    return max;
}
// console.log(LSS1([-1]));
// console.log(LSS1([-2,1,-3,4,-1,2,1,-5,4]));


// 动态规划 
function maxSubArray2(nums) {
    const len = nums.length; 
    let sum = max = nums[0];
    for (let i = 1; i < len; i++) {
        if(sum > 0) {
            sum += nums[i];
        } else {
            sum = nums[i];
        }
        max = Math.max(sum, max);
    }
    return max;
}
console.log(maxSubArray2([-1]));
console.log(maxSubArray2([-2,1,-3,4,-1,2,1,-5,4]));