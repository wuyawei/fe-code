/* 
给定一个数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值。

 

进阶：

你能在线性时间复杂度内解决此题吗？

 

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

1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4
1 <= k <= nums.length
*/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
// 前置：
// 如果一个一直最大值的队列新增一个数字，只要判断最大值和此值就行了
// 但是如果减掉一个，就需要判断减少的是否是最大值，如果不是，同上
// 如果减少的是最大值，就需要从头查找最大值了
// 所以维护一个最大值的单调递减队列，最大值在queue[0]，如果减少的是最大值，直接shift就好，第二大值就会到[0]的位置，后需添加继续比较就好
var maxSlidingWindow = function(nums, k) {
    const res = [];
    const maxQueue = [];
    for(let i = 0; i < nums.length; i++) {
        // 已装填的最后一个如果小于将要填充这个，将其删除
        // 循环到队列中元素都判断完
        // 保证队列是单调递减的
        while(maxQueue.length > 0 && maxQueue[maxQueue.length-1] < nums[i]) {
            maxQueue.pop();
        }
        maxQueue.push(nums[i]);
        if(i >= k -1) {
            // 此时每次都是新窗口
            // maxQueue[0]刚好是这个窗口的最大值，maxQueue[1]是第二大的，如果有的话 
            // 第一个为当前窗口最大值
            res.push(maxQueue[0]);
            // 此时要判断是否需要移除一位
            // 如果此时的最大值，刚好是当前窗口的第一位，则需要将这个最大值移除掉
            // 当前窗口第二大的值，将会移动到 maxQueue[0]
            if(maxQueue.length > 0 && maxQueue[0] === nums[i - k + 1]) {
                maxQueue.shift();
            }
        }
    }
    return res;
};