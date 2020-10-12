/* 
给定一个整数 n，生成所有由 1 ... n 为节点所组成的 二叉搜索树 。

 

示例：

输入：3
输出：
[
  [1,null,3,2],
  [3,2,null,1],
  [3,1,null,null,2],
  [2,1,3],
  [1,null,2,null,3]
]
解释：
以上的输出对应以下 5 种不同结构的二叉搜索树：

   1         3     3      2      1
    \       /     /      / \      \
     3     2     1      1   3      2
    /     /       \                 \
   2     1         2                 3
 

提示：

0 <= n <= 8
*/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number} n
 * @return {TreeNode[]}
 */
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
 }
 var generateTrees = function(n) {
     if(n === 0) return [];
     function buildTree(start, end) {
         const res = [];
         // 核心，没有子节点时，left或right为null
         if (start > end) {
             return [null];
         };
         for(let i = start; i<=end; i++) {
             const left = buildTree(start, i - 1);
             const right = buildTree(i + 1, end);
             for(let leftNode of left) {
                 for(let rightNode of right) {
                     const node = new TreeNode(i);
                     node.left = leftNode;
                     node.right = rightNode;
                     res.push(node);
                 }
             }
         }
         return res;
     }
     return buildTree(1, n);
 };