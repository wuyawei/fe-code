/* 
输入一棵二叉树和一个整数，打印出二叉树中节点值的和为输入整数的所有路径。从树的根节点开始往下一直到叶节点所经过的节点形成一条路径。

 

示例:
给定如下二叉树，以及目标和 sum = 22，

              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
返回:

[
   [5,4,11,2],
   [5,8,4,5]
]

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
    const res = [];
    const arr = [];
    const travers = (node) => {
        if(node === null) {
            return;
        };
        arr.push(node.val);
        if(arr.reduce((pre, cur) => pre+cur) === sum && node.left === null && node.right === null) {
            res.push([...arr]);
        }
        travers(node.left);
        travers(node.right);
        arr.pop();
    }
    travers(root);
    return res;
};