/* 
给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。

示例:

输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
解释: 

  滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
 

提示：

你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。

*/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
// 暴力解法
var maxSlidingWindow = function(nums, k) {
    let result = [];
    let index = 0;
    while(k <= nums.length && nums.length) {
        const slide = nums.slice(index, k);
        let max = -Number.MAX_VALUE;
        for(let i = 0; i < slide.length; i++) {
            max = Math.max(max, slide[i]);
        }
        result.push(max);
        index++;
        k++;
    }
    return result;
};
// 暴力
var maxSlidingWindow2 = function(nums, k) {
    if(k <= 1) return nums;
    let result = [];
    let index = 0;
    while(index <= nums.length - k) {
        const slide = nums.slice(index, index + k);
        result.push(Math.max(...slide));
        index++;
    }
    return result;
};