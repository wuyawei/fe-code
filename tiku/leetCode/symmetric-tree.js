/* 
给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。{left, val, right}

    1
   / \
  2   2
 / \ / \
3  4 4  3

但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

    1
   / \
  2   2
   \   \
   3    3
 
进阶：

你可以运用递归和迭代两种方法解决这个问题吗？
*/


// 递归
var isSymmetric = function(root) {
    if(root === null) return true;
    const isMirror = (t1, t2) => {
        if(t1 === null && t2 === null) {
            return true;
        }
        if(t1 === null || t2 === null) {
            return false;
        }
        return t1.val === t2.val && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
    }
    return isMirror(root, root);
};


// 迭代
var isSymmetric1 = function(root) {
    const queue = [root, root];
    while(queue.length) {
        const t1 = queue.pop();
        const t2 = queue.pop();
        if (t1 === null && t2 === null) continue;
        if(t1 === null || t2 === null) return false;
        if (t1.val === t2.val) {
            queue.push(t1.left, t2.right, t1.right, t2.left);
        } else {
            return false;
        }
    }
    return true;
};