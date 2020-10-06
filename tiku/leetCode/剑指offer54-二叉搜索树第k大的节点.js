/* 
给定一棵二叉搜索树，请找出其中第k大的节点。

 

示例 1:

输入: root = [3,1,4,null,2], k = 1
   3
  / \
 1   4
  \
   2
输出: 4
示例 2:

输入: root = [5,3,6,2,4,null,null,1], k = 3
       5
      / \
     3   6
    / \
   2   4
  /
 1
输出: 4
 

限制：

1 ≤ k ≤ 二叉搜索树元素个数
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
// 二处搜索树的中序遍历为排序后的节点
// 递归
var kthLargest = function(root, k) {
    const res = [];
    const travers = (node) => {
        if(!node) return null;
        travers(node.left);
        res.push(node.val);
        travers(node.right);
    }
    travers(root);
    return res[res.length - k];
};


// 迭代
var kthLargest1 = function(root, k) {
    const res = [];
    const stack = [];
    while(root || stack.length){
        while(root) {
            stack.push(root);
            root = root.right;
        }
        const node = stack.pop();
        res.push(node.val);
        root = node.left;
    }
    return res[k - 1];
};