/* 
请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

 

例如:
给定二叉树: [3,9,20,null,null,15,7],

    3
   / \
  9  20
    /  \
   15   7
返回其层次遍历结果：

[
  [3],
  [20,9],
  [15,7]
]

*/

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(root === null) return [];
    const result = [];
    const travers = (node, res, idx) => {
        if(node === null) return;
        if(!res[idx]) {
            res[idx] = [];
        }
        // 奇数列开头添加即可
        if(idx % 2 === 0) {
            res[idx++].push(node.val);
        } else {
            res[idx++].unshift(node.val);
        }
        travers(node.left, res, idx);
        travers(node.right, res, idx);
    }
    travers(root, result, 0);
    return result;
};