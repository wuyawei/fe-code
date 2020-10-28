/* 
给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。

你的算法时间复杂度必须是 O(log n) 级别。

如果数组中不存在目标值，返回 [-1, -1]。

示例 1:

输入: nums = [5,7,7,8,8,10], target = 8
输出: [3,4]
示例 2:

输入: nums = [5,7,7,8,8,10], target = 6
输出: [-1,-1]
*/

// O(n) 解法
var searchRange = function(nums, target) {
    let res = [];
    for(let i = 0; i < nums.length; i++) {
        if(nums[i] === target) {
            if(!res.length) {
                res = [i, i];
            } else {
                res[1] = i;
            }
        }
    }
    return res.length ? res : [-1, -1];
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// 二分查找
var searchRange2 = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while(left <= right) {
        let pointIndex = Math.floor((right + left) / 2);
        if(target < nums[pointIndex]) {
            right = pointIndex - 1;
        } else if(target > nums[pointIndex]) {
            left = pointIndex + 1;
        } else {
            left = right = pointIndex;
            while(target === nums[--left]){};
            while(target === nums[++right]){};
            return [left + 1, right - 1];
        }
    }
    return [-1, -1];
};