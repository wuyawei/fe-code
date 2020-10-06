/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
    const res = [];
    const stack = [];
    while(root || stack.length){
        while(root) {
            stack.push(root);
            root = root.left;
        }
        const node = stack.pop();
        res.push(node.val);
        root = node.right;
    }
    return res[k - 1];
};