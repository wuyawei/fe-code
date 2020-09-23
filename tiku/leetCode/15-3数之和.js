/* 
给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

 

示例：

给定数组 nums = [-1, 0, 1, 2, -1, -4]，

满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]

*/

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    const res = [];
    if(!nums || nums.length < 3) return res;
    // 排序
    nums = nums.sort((a,b) => a-b);
    for(let i =0; i< nums.length; i++) {
        // 去重
        if(i>0 && nums[i] === nums[i-1]) continue;
        let l = i + 1;
        let r = nums.length - 1;
        while(l < r) {
            const sum = nums[i] + nums[l] + nums[r];
            if(sum > 0) {
                r--;
            } else if(sum < 0) {
                l++;
            } else {
                res.push([nums[i], nums[l], nums[r]]);
                // 去重
                while(nums[l] === nums[++l]);
                while(nums[r] === nums[--r]);
            }
        }
    }
    return res;
};