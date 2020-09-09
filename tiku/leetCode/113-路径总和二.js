/*
 * @lc app=leetcode.cn id=113 lang=javascript
 *
 * [113] 路径总和 II
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {number[][]}
 */
var pathSum = function(root, sum) {
    const targetArr = [];
    const computedArr = [];
    const selectArr = (node) => {
        if(node === null) return;
        computedArr.push(node.val);
        selectArr(node.left);
        selectArr(node.right);
        if(node.left === null && node.right === null && computedArr.reduce((pre, cur) => pre + cur) === sum) {
            targetArr.push([...computedArr]);
        }
        computedArr.pop();
    }
    selectArr(root);
    return targetArr;
};
// @lc code=end

