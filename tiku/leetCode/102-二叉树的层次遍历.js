/* 
给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。

 

示例：
二叉树：[3,9,20,null,null,15,7],

    3
   / \
  9  20
    /  \
   15   7
返回其层次遍历结果：

[
  [3],
  [9,20],
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
// 迭代
var levelOrder = function(root) {
    if(root === null) return [];
    const result = [];
    const queue = [root];
    while(queue.length) {
        // 用 currLevel 做出队
        // 因为 queue 会继续添加子节点，length 会变
        // 
        let currLevel = queue.length;
        const currNodes = [];
        while(currLevel > 0) {
            const node = queue.shift();
            currNodes.push(node.val);
            if(node.left) {
                queue.push(node.left);
            }
            if(node.right) {
                queue.push(node.right);
            }
            currLevel--;
        }
        result.push(currNodes);
    }
    return result;
};


// 递归
var levelOrder = function(root) {
    if(root === null) return [];
    const result = [];
    const travers = (node, res, idx) => {
        if(node === null) return;
        if(!res[idx]) {
            res[idx] = [];
        }
        res[idx++].push(node.val);
        travers(node.left, res, idx);
        travers(node.right, res, idx);
    }
    travers(root, result, 0);
    return result;
};