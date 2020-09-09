/*
 * @lc app=leetcode.cn id=112 lang=javascript
 *
 * [112] 路径总和
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
 * @return {boolean}
 */
var hasPathSum1 = function(root, sum) {
    let _sum = 0;
    let has = false;
    const computedSum = (node) => {
        if(node === null) return;
        _sum += node.val;
        computedSum(node.left);
        computedSum(node.right);
        if(node.left === null && node.right === null && _sum === sum) {
            has = true;
        }
        if(!has){
            _sum -= node.val;
        }
    }
    computedSum(root);
    return has;
};
var hasPathSum = function(root, sum) {
    if(root === null) return false;
    sum -= root.val;
    if(root.left === null && root.right === null) {
        return sum === 0;
    } else {
        return hasPathSum(root.left, sum) || hasPathSum(root.right, sum);
    }
};

