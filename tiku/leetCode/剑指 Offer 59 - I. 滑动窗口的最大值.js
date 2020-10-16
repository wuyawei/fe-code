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

// 动态规划
var maxSlidingWindow3 = function(nums, k) {
    if(k <= 1) return nums;
    let len = nums.length;
    const left = [];
    const right = [];
    const res = [];
    left[0] = nums[0];
    right[len-1] = nums[len-1];
    for (let i = 1; i < len; i++) {
        // 如果不能取余，就交换最大值
        // 可以取余，说明前一个窗口已经走完，直接赋值
        // 需要注意 窗口下标是 0 1 2 而不是 1 2 3，能整除说明是新窗口的开始
        // left 右边最大
        if(i % k) {
            left[i] = Math.max(nums[i], left[i -1]);
        } else {
            left[i] = nums[i];
        }

        // right 倒着来一次
        let j = len - 1 - i; // 起点
        // j + 1 是因为如果 j+1个能整除 k，说明当前这个是倒序的新窗口的第一个
        // right 左边最大
        if((j + 1) % k) {
            right[j] = Math.max(nums[j], right[j+1]);
        } else {
            right[j] = nums[j];
        }
    }

    // i 的截止位置是 最后一个滑动窗口的第一个位置的下标 包含这个位置
    for(let i = 0; i <= len - k; i++) {
        res.push(Math.max(right[i], left[i + k - 1]))
    }
    return res;
}