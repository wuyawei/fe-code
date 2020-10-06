/* 
输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 true，否则返回 false。假设输入的数组的任意两个数字都互不相同。

 

参考以下这颗二叉搜索树：

     5
    / \
   2   6
  / \
 1   3
示例 1：

输入: [1,6,3,2,5]
输出: false
示例 2：

输入: [1,3,2,6,5]
输出: true

*/

/**
 * @param {number[]} postorder
 * @return {boolean}
 */
var verifyPostorder = function(postorder) {
    const len = postorder.length;
    if(len < 2) return true;
    const root = postorder[len -1];
    let i = 0;
    while(i < len-1) {
        if(postorder[i] > root) {
            break;
        }
        i++;
    }
    const result = postorder.slice(i, len-1).every(v => v > root);
    if(result) {
       return verifyPostorder(postorder.slice(0, i)) && verifyPostorder(postorder.slice(i, len-1))
    } else {
        return false;
    }
};