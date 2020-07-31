// 二叉搜索树
class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    node(key) {
        return {
            key: key,
            left: null,
            right: null
        }
    }
    insert(insertKey) {
        const insertNode = (node, newNode) => {
            if(newNode.key < node.key) {
                if(node.left === null) {
                    node.left = newNode;
                } else {
                    insertNode(node.left, newNode);
                }
            } else if(newNode.key > node.key) {
                if(node.right === null) {
                    node.right = newNode;
                } else {
                    insertNode(node.right, newNode)
                }
            }
        }
        const newNode = this.node(insertKey);
        if (this.root === null) {
            this.root = newNode;
        } else {
            insertNode(this.root, newNode);
        }
    }
    search(searchKey) {
        const searchNode = (node, key) => {
            if(node === null) return false;
            if (key < node.key) {
                searchNode(node.left, key);
            } else if(key > node.key) {
                searchNode(node.right, key);
            } else {
                return true;
            }
            return false;
        }
        return searchNode(this.root, searchKey);
    }
    // 中序遍历 先去比自己小的 再到自己 再到比自己大的
    inOrderTraverse(callback) {
        const inOrderTraverseNode = (node, fn) => {
            if(node === null) return;
            inOrderTraverseNode(node.left, fn);
            fn(node.key)
            inOrderTraverseNode(node.right, fn);
        }
        inOrderTraverseNode(this.root, callback)
    }
    
    // 先序遍历 优先自己 再比自己小的 最后比自己大的
    preOrderTraverse(callback) {
        const preOrderTraverseNode = (node, fn) => {
            if(node === null) return;
            fn(node.key)
            preOrderTraverseNode(node.left, fn);
            preOrderTraverseNode(node.right, fn);
        }
        preOrderTraverseNode(this.root, callback)
    }
    
    // 后序遍历 先小的  再大的 最后自己
    postOrderTraverse(callback) {
        const postOrderTraverseNode = (node, fn) => {
            if(node === null) return;
            postOrderTraverseNode(node.left, fn);
            postOrderTraverseNode(node.right, fn);
            fn(node.key)
        }
        postOrderTraverseNode(this.root, callback)
    }

    remove(searchKey) {
        const removeNode = (node, key) => {
            if(node === null) return null;
            if(key < node.key) {
                node.left = removeNode(node.left, key);
                return node;
            } else if(key > node.ley) {
                node.right = removeNode(node.right, key);
                return node;
            } else {
                // 没有子节点
                if(node.left === null && node.right === null) {
                    node = null;
                    return node;
                }
                // 只有右子节点
                if(node.left === null && node.right) {
                    node = node.right;
                    return node;
                }
                // 只有左子节点
                if(node.left && node.right === null) {
                    node = node.left;
                    return node;
                }
                // 有两个子节点
                if(node.left && node.right) {
                    const tmp = node.right;
                    const min = this.findMinKey(tmp);
                    node.key = min;
                    node.right = removeNode(tmp, min);
                    return node;
                }
            }

        }
        removeNode(this.root, searchKey);
    }

    // 最大值
    max() {
        const node = this.root;
        while(node && node.right) {
            node = node.right;
        }
        if (node) {
            return node.key;
        }
        return null;
    }

    findMinKey(node) {
        while(node && node.left) {
            node = node.left;
        }
        if (node) {
            return node.key;
        }
        return null;
    }

    //最小值
    min() { 
        return this.findMinKey(this.root);
    }
}


// 自平衡二叉搜索树
// 节点高度计算
// 左右节点每多一个子节点计数+1
// 平衡因子的计算则需保证 左右相差不超过 1
// 如果超过 则需要旋转
const heightNode = function(node) {
    if (node === null) {
        return -1; 
    } else {
        return Math.max(heightNode(node.left),
        heightNode(node.right)) + 1;
    }
};
//    10
//   5  12
//  4 8    
const binarySearchTree = new BinarySearchTree()
binarySearchTree.insert(10);
binarySearchTree.insert(5);
binarySearchTree.insert(8);
// binarySearchTree.insert(4);
binarySearchTree.insert(12);
console.log(binarySearchTree.root)
console.log(heightNode(binarySearchTree.root.right) - heightNode(binarySearchTree.root.left));

// 旋转
// 新插入的子节点在右子节点的右边，进行向左的单旋转
// 此时右边多了一个
// 右子节点肯定比 node 大， 而右子节点的左子节点肯定比 node 大且比 右子节点 小
// 所以可以将右子节点的左子节点 挂在 node 的右子节点上，将 node 整体挂在右子节点上，替换原来的node 从而减少一层
//    10                     12
//   5  12       ===>     10    16
//     11 16             5  11    27
//         27
const rotationRR = (node) => {
    const tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    return tmp;
}

// 新插入的子节点在左子节点的左边，进行向右的单旋转
// 原理同上
//    10               5
//   5  12   ===>     4 10 
//  4                3   12
// 3            
const rotationLL = (node) => {
    const tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    return tmp;
}

// 新插入的子节点在左子节点的右边，进行向右的双旋转
// 先将左子节点进行一次进行向左的单旋转
// 再将整体进行进行向右的单旋转
//    10               10                 6
//   5  12   ===>     6  12   ===>      5   10
//  4 6              5 8               4   8  12
//     8            4
const rotationLR = (node) => {
    node.left = rotationRR(node.left);
    return rotationLL(node);
}


// 新插入的子节点在右子节点的左边，进行向左的双旋转
//      10                 10                        11
//   5     15      ===>  5    11        ===>       10    15
//      11     16                15               5     13 16
//        13                   13  16
const rotationRL = (node) => {
    node.right = rotationLL(node.right);
    return rotationRR(node);
}

const insertNodeAVL = (node, newNode) => {
    if(newNode.key < node.key) {
        if(node.left === null) {
            node.left = newNode;
        } else {
            node.left = insertNode(node.left, newNode);
            if(node.left !== null) {
                if(heightNode(node.left)- heightNode(node.right) > 1) {
                    if(newNode.key < node.left.key) {
                        node = rotationLL(node);
                    } else {
                        node = rotationLR(node);
                    }
                }
            }
        }
    } else if(newNode.key > node.key) {
        if(node.right === null) {
            node.right = newNode;
        } else {
            node.right = insertNode(node.right, newNode)
            if(node.right !== null) {
                if(heightNode(node.right)- heightNode(node.left) > 1) {
                    if(newNode.key > node.right.key) {
                        node = rotationRR(node);
                    } else {
                        node = rotationRL(node);
                    }
                }
            }
        }
    }
    return node;
}
